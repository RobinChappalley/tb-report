#import "../styles.typ" : page-admin
#import "../variables.typ" as vars

#page-admin("Authentification")[
#set par(justify: true)
  J’atteste par la présente avoir réalisé ce travail et n’avoir utilisé aucune autre source que celles expressément mentionnées.
  #v(2cm)
  *Prénom Nom*
  
 #vars.author.name
  #v(2cm)

*Signature*
  #v(2cm)
#line(length: 50%, stroke: 0.1mm)
* #vars.city, le  #vars.date.display("[day]-[month]-[year]")*
  #v(2cm)
#line(length: 50%, stroke: 0.1mm)

  
]
