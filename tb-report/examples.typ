// examples.typ — Traduction de examples.tex
#import "variables.typ": *

== Exemple d'équation

L'une des principales forces de LaTeX est la saisie d'équations. L'exemple suivant illustre une équation affichée :

$$
L(x,y) = \exp\left( - i\frac{2\pi}{\lambda}\left( n\Delta\varphi(x,y) + \Delta\varphi_0 - \Delta\varphi(x,y) \right)\right)
= \exp\left(i\frac{2\pi}{\lambda}\Delta\varphi_0\right)\,\exp\left( - i\frac{2\pi}{\lambda f}(x^2 + y^2)\right)
$$

== Exemples de diagrammes

Les diagrammes de flux peuvent être réalisés avec draw.io (diagrams.net) et exportés en PDF/SVG. Conservez les sources pour permettre les modifications ultérieures.

[// Remplacer par une image exportée :]
#image("assets/figures/euclide.drawio.pdf", width: 9cm)

== Exemple de figure

Pour présenter des résultats expérimentaux, préférez des formats vectoriels lorsque possible (SVG/PDF). Exemple :

#image("assets/figures/plot.svg.pdf", width: 80%)

== Tables et listings

Les tableaux doivent rester simples et lisibles. Pour insérer des extraits de code, utilisez un bloc de code avec coloration syntaxique.

```python
# Exemple Python (placeholder)
import math

def bode():
    pass
```
