// main.typ
#import "template.typ": rapport-tb, page-admin

#show: rapport-tb

// --- Pages liminaires (gèrent leur propre mise en page) ---
#include "pages-admin/title-page.typ"
#include "pages-admin/foreword.typ"
#include "pages-admin/thanks.typ"
#include "pages-admin/authenticity.typ"
#include "pages-admin/publiable-abstract.typ"



// --- Contenu ---
#include "contenu/01-introduction.typ"



#include "pages-admin/bachelor-thesis-conduct.typ"
#include "pages-admin/ai-usage-declaration.typ"
#include "pages-admin/confidentiality-declaration.typ"

#include "pages-admin/bilan-inter.typ"