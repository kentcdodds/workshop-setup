function oneLine(strings, ...interpolations) {
  const string = strings
    .map(
      (s, i) =>
        `${s}${interpolations[i] === undefined ? '' : interpolations[i]}`,
    )
    .join('')
    .split('\n')
    .join(' ')
    .split(' ')
    .filter(Boolean)
    .join(' ')

  return string
}

export default oneLine
