# Pathpunk

[![npm package][npm-img]][npm-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]

> My awesome module
> Note: This does not replace conventional react routers. Use this when you want a fairly small nagigation system on the same page

## Install

```bash
npm install pathpunk
```

## Usage

```ts
import Pathpunk from 'pathpunk';

const App = () => {
  return (
    <MiniRouter
      name="hobbies"
      routes={[
        { path: '/', component: <HobbiesComponent /> },
        { path: '/hobbies', component: <HobbiesComponent /> },
        {
          path: '/hobbies/[hobbyName]',
          component: <SingleHobbyComponent />,
        },
        {
          path: '/hobbies/:hobbyName',
          component: <SingleHobbyComponent />,
        },
      ]}
    />
  );
};
```

## API

### MiniRouter(props: MiniRouterProps): JSX.Element

#### props

Type: `MiniRouterProps`

Lorem ipsum.

##### name

Type: `string`

##### routes

Type: `Array`

Lorem ipsum.

[downloads-img]: https://img.shields.io/npm/dt/pathpunk
[downloads-url]: https://www.npmtrends.com/pathpunk
[npm-img]: https://img.shields.io/npm/v/pathpunk
[npm-url]: https://www.npmjs.com/package/pathpunk
[issues-img]: https://img.shields.io/github/issues/emekaorji/pathpunk
[issues-url]: https://github.com/emekaorji/pathpunk/issues
[codecov-img]: https://codecov.io/gh/emekaorji/pathpunk/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/emekaorji/pathpunk
