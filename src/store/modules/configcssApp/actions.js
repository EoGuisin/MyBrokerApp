export function addConfigCssApp(ColorHeader, ColorHeaderFonte, ColorButton, ColorFonte, Fonte) {
  return {
    type: '@cores/ADD_CORES_FONTES',
    colorheader: ColorHeader,
    colorheaderfonte: ColorHeaderFonte,
    colorbutton: ColorButton,
    colorfonte: ColorFonte,
    fonte: Fonte,
  }
}

export function cleanToConfigCssApp() {
  return {
    type: '@cores/INITIAL_STATE'
  }
}