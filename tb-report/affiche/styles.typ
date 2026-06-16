// ============================================================
// STYLES.TYP — Mise en page et styles typographiques
// ============================================================

// --- Couleurs ---
#let color-title    = rgb("#999999")
#let color-heading  = rgb("#2E74B5")
#let color-body     = black
#let color-footer   = black
#let color-placeholder = rgb("#CCCCCC")

// --- Polices ---
#let font-main   = "Arial"
#let font-footer = "Arial"

// --- Tailles ---
#let size-title   = 22pt
#let size-heading = 13pt
#let size-body    = 10pt
#let size-footer  = 8pt
#let size-meta    = 9pt

// --- Fonctions de style ---

// Titre principal (gris, centré, gras)
#let style-title(content) = text(
  font: font-main,
  size: size-title,
  weight: "bold",
  fill: color-title,
  content
)

// Titre de section (bleu, gras)
#let style-heading(content) = text(
  font: font-main,
  size: size-heading,
  weight: "bold",
  fill: color-heading,
  content
)

// Corps de texte standard
#let style-body(content) = text(
  font: font-main,
  size: size-body,
  fill: color-body,
  content
)

// Texte méta (auteur, prof, etc.)
#let style-meta(content) = text(
  font: font-main,
  size: size-meta,
  fill: color-body,
  content
)

// Pied de page
#let style-footer(content) = text(
  font: font-footer,
  size: size-footer,
  fill: color-footer,
  content
)

// Bloc section : titre + contenu
#let section(title, content) = {
  style-heading(title)
  v(4pt)
  style-body(content)
  v(12pt)
}

// Placeholder image
#let image-placeholder(w: 100%, h: 80pt) = rect(
  width: w,
  height: h,
  fill: color-placeholder,
  stroke: none,
  radius: 2pt
)

// Ligne méta (ex: "Auteur : Jean Dupont")
#let meta-line(key, value) = {
  style-meta([*#key* #value])
  linebreak()
}
