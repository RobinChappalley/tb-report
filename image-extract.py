#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import json
import time
import sys
import logging
import re

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

class SiteImageAudit:
    def __init__(self, base_url, max_pages=100, delay=0.5, include_external=True):
        self.base_url = base_url.rstrip("/")
        self.max_pages = max_pages
        self.delay = delay
        self.include_external = include_external
        self.visited = set()
        self.to_visit = [self.base_url]
        self.images = set()
        self.debug_images = []

    def run(self):
        while self.to_visit and len(self.visited) < self.max_pages:
            url = self.to_visit.pop(0)
            if url in self.visited:
                continue
            try:
                resp = requests.get(url, timeout=10, headers={"User-Agent": "HEIG-VD-AuditBot/1.0"})
                resp.raise_for_status()
                self.visited.add(url)
                count_before = len(self.images)
                self._extract_images(resp.text, url)
                logging.debug(f"[DEBUG] {url} -> +{len(self.images) - count_before} images trouvées")
                self._collect_links(resp.text, url)
                logging.info(f"Crawled: {url} (total pages: {len(self.visited)}, images: {len(self.images)})")
                time.sleep(self.delay)
            except requests.RequestException as e:
                logging.error(f"Échec sur {url}: {e}")
                self.visited.add(url)

        return {
            "target_domain": self.base_url,
            "pages_crawled": len(self.visited),
            "total_unique_images": len(self.images),
            "image_urls": sorted(list(self.images)),
            "sample_debug": self.debug_images[:10]
        }

    def _extract_images(self, html, current_url):
        soup = BeautifulSoup(html, "html.parser")
        for tag in soup.find_all(["img", "source"]):
            attrs_to_check = ["src", "data-src", "data-lazy-src", "srcset"]
            for attr in attrs_to_check:
                raw = tag.get(attr)
                if not raw: continue
                
                if attr == "srcset":
                    entries = [e.strip().split()[0] for e in raw.split(",")]
                    for src in entries:
                        self._add_image(src, current_url)
                else:
                    self._add_image(raw.strip(), current_url)

        # Extraction des images en background-image dans le CSS / style
        css_urls = re.findall(r'url\(\s*(["\']?)([^)]+)\1\s*\)', html)
        for _, bg_url in css_urls:
            bg_url = bg_url.strip("\"' ")
            if bg_url and not bg_url.startswith("data:"):
                self._add_image(bg_url, current_url)

    def _add_image(self, src, base_url):
        if not src: return
        full_url = urljoin(base_url, src)
        parsed = urlparse(full_url)
        
        # Vérification extension stricte
        ext_match = re.search(r'\.(jpg|jpeg|png|webp|avif|gif|svg|bmp|tiff)(\?.*)?$', parsed.path, re.IGNORECASE)
        if not ext_match: return

        # Filtre domaine (optionnel)
        if not self.include_external:
            base_netloc = urlparse(self.base_url).netloc.replace("www.", "")
            if parsed.netloc.replace("www.", "") != base_netloc:
                return

        self.images.add(full_url)
        if len(self.debug_images) < 10:
            self.debug_images.append(full_url)

    def _collect_links(self, html, current_url):
        soup = BeautifulSoup(html, "html.parser")
        base_parsed = urlparse(self.base_url)
        
        excluded_exts = (
            '.pdf', '.zip', '.rar', '.doc', '.docx', '.xls', '.xlsx', 
            '.ppt', '.pptx', '.jpg', '.jpeg', '.png', '.gif', '.svg', 
            '.webp', '.mp4', '.avi', '.mp3', '.css', '.js', '.json', '.xml',
            '.woff', '.woff2', '.ttf', '.eot'
        )

        for a in soup.find_all("a", href=True):
            link = urljoin(current_url, a["href"])
            # Retirer le fragment de l'URL pour unifier
            link_no_fragment = link.split('#')[0]
            parsed = urlparse(link_no_fragment)
            
            if (parsed.netloc == base_parsed.netloc and 
                link_no_fragment not in self.visited and 
                link_no_fragment not in self.to_visit and
                not link_no_fragment.startswith(("mailto:", "tel:", "javascript:")) and
                not parsed.path.lower().endswith(excluded_exts)):
                self.to_visit.append(link_no_fragment)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python audit_images.py <url> [max_pages] [include_external(true/false)] [output_file]")
        sys.exit(1)
    
    max_p = int(sys.argv[2]) if len(sys.argv) > 2 else 100
    ext = sys.argv[3].lower() == "false" if len(sys.argv) > 3 else False
    output_file = sys.argv[4] if len(sys.argv) > 4 else "resultat_images.json"
    
    logging.getLogger().setLevel(logging.DEBUG if ext else logging.INFO)
    
    audit = SiteImageAudit(sys.argv[1], max_pages=max_p, include_external=not ext)
    result = audit.run()
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
        
    print(f"\n✅ Audit terminé. Les résultats ont été enregistrés dans : {output_file}")

