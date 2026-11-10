const ICON_ARIA_LABELS: Partial<Record<string, string>> = {
  more: 'More options',
  close: 'Close',
  menu: 'Open menu',
  bell: 'Notifications',
  help: 'Help',
  undo: 'Undo',
  redo: 'Redo',
  plus: 'Add item',
  eye: 'Preview',
  chevron: 'Open',
  arrow: 'Continue',
}

export function autoApplyButtonAriaLabels() {
  document
    .querySelectorAll<HTMLButtonElement>('button:not([aria-label])')
    .forEach((button) => {
      if (!button.textContent?.trim()) {
        const icon =
          button.querySelector<SVGElement>('svg[data-icon]')?.dataset.icon
        const label = (icon && ICON_ARIA_LABELS[icon]) || 'Action'
        button.setAttribute('aria-label', label)
        button.setAttribute('title', label)
      }
    })
}
