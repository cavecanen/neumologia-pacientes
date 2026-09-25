# Validación de modelos — 25/09/2026

Implementación: Brock/PanCan modelo completo 2b de McWilliams et al. (NEJM 2013), y Herder 2005 con probabilidad previa Mayo/Swensen 1997 a precisión completa. Se comparó cada caso con la interfaz pública OncoToolkit, que publica coeficientes y desglose numérico. La calculadora oficial BTS documenta las mismas variables y categorías, pero su interfaz requiere aceptación de condiciones y no se utilizó para una segunda comparación numérica.

| Modelo | Caso sintético | Referencia | Aplicación | Diferencia |
|---|---|---:|---:|---:|
| Brock | 62 años, varón, 10 mm sólido, 4 nódulos, sin otros factores | 2,5% | 2,510027% | 0,010 pp |
| Brock | 70 años, mujer, familiar, enfisema, 16 mm part-solid, superior, 1 nódulo, espiculado | 72,0% | 72,021893% | 0,022 pp |
| Brock | 55 años, varón, 7 mm GGO, 2 nódulos, sin otros factores | 0,8% | 0,758233% | 0,042 pp |
| Herder | 62 años, nunca fumador, 10 mm sólido, sin cáncer, espiculación ni lóbulo superior; PET ausente | 1,01082033096799% | 1,010820330968% | <1e-10 pp |
| Herder | 70 años, fumador, cáncer extratorácico >5 años, 20 mm, superior, espiculado; PET moderado | 96,3229402716489% | 96,322940271649% | <1e-10 pp |
| Herder | 65 años, nunca fumador, sin cáncer, 12 mm, superior, no espiculado; PET tenue | 12,2766376508559% | 12,276637650856% | <1e-10 pp |

Referencias de comparación: https://oncotoolkit.com/calculator/brock-lung-nodule-malignancy-calculator y https://oncotoolkit.com/calculator/herder-lung-nodule-prediction-model. Modelos originales: https://pmc.ncbi.nlm.nih.gov/articles/3951177/ y https://pubmed.ncbi.nlm.nih.gov/16236914/. Guía BTS: https://www.brit-thoracic.org.uk/clinical-resources/guidelines/pulmonary-nodules/pn-risk-calculator/.

Herder se desactiva para GGO, part-solid, múltiples nódulos y cáncer reciente. Los umbrales clínicos proceden de BTS y la vigilancia sub-sólida de Fleischner. La concordancia matemática no equivale a validación clínica prospectiva del producto.

Publicación: 25/09/2026, módulo independiente en GitHub Pages, tras comparación matemática. La verificación en navegador de cálculo, informe y QR se efectuó con un caso sintético. La comprobación sin red de la instalación queda pendiente de prueba manual en dispositivo.
