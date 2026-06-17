// main.typ
#import "template.typ": rapport-tb, page-admin

#show: rapport-tb

// --- Pages liminaires (gèrent leur propre mise en page) ---
#include "pages-admin/title-page.typ"
#include "pages-admin/authenticity.typ"

// --- Contenu ---
#include "contenu/01-introduction.typ"
