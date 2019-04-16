import cases from 'jest-in-case'
import oneLine from '../one-line'

cases(
  'one-line',
  output => {
    expect(output).not.toContain('\n')
    expect(output).not.toContain('  ')
  },
  [
    oneLine`
    foo

    bar
  `,
    oneLine`foo
  baz
     buz
  `,
  ],
)
