# Yall

<p align="center">
    <img alt="Yall logo"  src="https://github.com/Amber-Williams/yall/blob/main/quick-draw.gif" width="500"/>
</p>
<p align="center">
  <a href="https://github.com/Amber-Williams/yall/actions/workflows/release.yml">
    <img alt="Build states" src="https://github.com/Amber-Williams/yall/actions/workflows/release.yml/badge.svg">
  </a>
  <a href="#badge">
    <img alt="semantic-release: angular" src="https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release">
  </a>
  <a href="https://www.npmjs.com/package/yall-cli">
    <img alt="Downloads a month" src="https://img.shields.io/npm/dm/yall-cli.svg">
  </a>
</p>

A CLI tool to launch applications in half the time

<img alt="Welcome to Yall" src="https://github.com/Amber-Williams/yall/blob/main/demo.gif" width="600" />

## Support

| Operating System    | Support       |
| ------------------- | ------------- |
| macOS (Silicon M1)  | Supported     |
| macOS (Intel chips) | Unknown       |
| Windows             | Not supported |
| Linux               | Not supported |
| Other OS            | Not supported |

</br>

| Application        | Support   |
| ------------------ | --------- |
| Chrome             | Supported |
| Visual Studio Code | Supported |
| PyCharm            | Supported |
| Notion             | Supported |

#### Installation

`npm install -g yall-cli`

Recommended:

- Setup of `code` alias to launch new windows of VSCode [Installation](https://code.visualstudio.com/docs/setup/mac)

#### Customize your flow

Run `yall --edit`

#### Run math evaluations from your terminal

Run `yall --math <eval>`
Examples include:
`yall --math 12,000 + 4,000` => `12400`
`yall --math 12_000 + 4_000` => `12400`
`yall --math 12.7 cm to inch` => `5 inch`
`yall --math sin(45 deg) ^ 2` => `0.5`
`yall --math 9 / 3 + 2i` => `3 + 2i`
