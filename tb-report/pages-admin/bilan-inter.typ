#import "@preview/cmarker:0.1.8"

#heading(numbering : none, level: 1, outlined: true)[PV du bilan intermédiaire]

#{
  set heading(numbering: none, outlined: false, level:auto )
  cmarker.render(read("pv-bilan.md"))
}