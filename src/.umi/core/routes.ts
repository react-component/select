// @ts-nocheck
import React from 'react';
import { ApplyPluginsType } from '/Users/jilin/projects/antd/rc-select/node_modules/_@umijs_runtime@3.5.20@@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
    {
      path: '/~demos/:uuid',
      layout: false,
      wrappers: [
        require('/Users/jilin/projects/antd/rc-select/node_modules/_@umijs_preset-dumi@1.1.32@@umijs/preset-dumi/lib/theme/layout')
          .default,
      ],
      component: (props) => {
        const {
          default: getDemoRenderArgs,
        } = require('/Users/jilin/projects/antd/rc-select/node_modules/_@umijs_preset-dumi@1.1.32@@umijs/preset-dumi/lib/plugins/features/demo/getDemoRenderArgs');
        const { default: Previewer } = require('dumi-theme-default/es/builtins/Previewer.js');
        const { default: demos } = require('@@/dumi/demos');
        const { usePrefersColor } = require('dumi/theme');

        const renderArgs = getDemoRenderArgs(props, demos);

        // for listen prefers-color-schema media change in demo single route
        usePrefersColor();

        switch (renderArgs.length) {
          case 1:
            // render demo directly
            return renderArgs[0];

          case 2:
            // render demo with previewer
            return React.createElement(Previewer, renderArgs[0], renderArgs[1]);

          default:
            return `Demo ${props.match.params.uuid} not found :(`;
        }
      },
    },
    {
      path: '/_demos/:uuid',
      redirect: '/~demos/:uuid',
    },
    {
      __dumiRoot: true,
      layout: false,
      path: '/',
      wrappers: [
        require('/Users/jilin/projects/antd/rc-select/node_modules/_@umijs_preset-dumi@1.1.32@@umijs/preset-dumi/lib/theme/layout')
          .default,
        require('/Users/jilin/projects/antd/rc-select/node_modules/_@umijs_preset-dumi@1.1.32@@umijs/preset-dumi/node_modules/dumi-theme-default/es/layout.js')
          .default,
      ],
      routes: [
        {
          path: '/',
          component: require('/Users/jilin/projects/antd/rc-select/README.md').default,
          exact: true,
          meta: {
            locale: 'en-US',
            order: null,
            filePath: 'README.md',
            updatedTime: 1623901353000,
            slugs: [
              {
                depth: 1,
                value: 'rc-select',
                heading: 'rc-select',
              },
              {
                depth: 2,
                value: 'Screenshots',
                heading: 'screenshots',
              },
              {
                depth: 2,
                value: 'Feature',
                heading: 'feature',
              },
              {
                depth: 3,
                value: 'Keyboard',
                heading: 'keyboard',
              },
              {
                depth: 2,
                value: 'install',
                heading: 'install',
              },
              {
                depth: 2,
                value: 'Usage',
                heading: 'usage',
              },
              {
                depth: 3,
                value: 'basic use',
                heading: 'basic-use',
              },
              {
                depth: 2,
                value: 'API',
                heading: 'api',
              },
              {
                depth: 3,
                value: 'Select props',
                heading: 'select-props',
              },
              {
                depth: 3,
                value: 'Methods',
                heading: 'methods',
              },
              {
                depth: 3,
                value: 'Option props',
                heading: 'option-props',
              },
              {
                depth: 3,
                value: 'OptGroup props',
                heading: 'optgroup-props',
              },
              {
                depth: 2,
                value: 'Development',
                heading: 'development',
              },
              {
                depth: 2,
                value: 'Example',
                heading: 'example',
              },
              {
                depth: 2,
                value: 'Test Case',
                heading: 'test-case',
              },
              {
                depth: 2,
                value: 'Coverage',
                heading: 'coverage',
              },
              {
                depth: 2,
                value: 'License',
                heading: 'license',
              },
            ],
            title: 'rc-select',
          },
          title: 'rc-select',
        },
        {
          path: '/demo/auto-adjust-dropdown',
          component:
            require('/Users/jilin/projects/antd/rc-select/docs/demo/auto-adjust-dropdown.md')
              .default,
          exact: true,
          meta: {
            filePath: 'docs/demo/auto-adjust-dropdown.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'auto-adjust-dropdown',
                heading: 'auto-adjust-dropdown',
              },
            ],
            title: 'auto-adjust-dropdown',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'auto-adjust-dropdown - rc-select',
        },
        {
          path: '/demo/combobox',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/combobox.md').default,
          exact: true,
          meta: {
            filePath: 'docs/demo/combobox.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'combobox',
                heading: 'combobox',
              },
            ],
            title: 'combobox',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'combobox - rc-select',
        },
        {
          path: '/demo/controlled',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/controlled.md')
            .default,
          exact: true,
          meta: {
            filePath: 'docs/demo/controlled.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'controlled',
                heading: 'controlled',
              },
            ],
            title: 'controlled',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'controlled - rc-select',
        },
        {
          path: '/demo/custom-icon',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/custom-icon.md')
            .default,
          exact: true,
          meta: {
            filePath: 'docs/demo/custom-icon.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'custom-icon',
                heading: 'custom-icon',
              },
            ],
            title: 'custom-icon',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'custom-icon - rc-select',
        },
        {
          path: '/demo/custom-selector',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/custom-selector.md')
            .default,
          exact: true,
          meta: {
            filePath: 'docs/demo/custom-selector.md',
            updatedTime: 1637312406607,
            slugs: [
              {
                depth: 2,
                value: 'custom-selector',
                heading: 'custom-selector',
              },
            ],
            title: 'custom-selector',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'custom-selector - rc-select',
        },
        {
          path: '/demo/custom-tags',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/custom-tags.md')
            .default,
          exact: true,
          meta: {
            filePath: 'docs/demo/custom-tags.md',
            updatedTime: 1637312406607,
            slugs: [
              {
                depth: 2,
                value: 'custom-tags',
                heading: 'custom-tags',
              },
            ],
            title: 'custom-tags',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'custom-tags - rc-select',
        },
        {
          path: '/demo/debug',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/debug.md').default,
          exact: true,
          meta: {
            filePath: 'docs/demo/debug.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'debug',
                heading: 'debug',
              },
            ],
            title: 'debug',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'debug - rc-select',
        },
        {
          path: '/demo/dropdown-render',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/dropdownRender.md')
            .default,
          exact: true,
          meta: {
            filePath: 'docs/demo/dropdownRender.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'dropdownRender',
                heading: 'dropdownrender',
              },
            ],
            title: 'dropdownRender',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'dropdownRender - rc-select',
        },
        {
          path: '/demo/email',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/email.md').default,
          exact: true,
          meta: {
            filePath: 'docs/demo/email.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'email',
                heading: 'email',
              },
            ],
            title: 'email',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'email - rc-select',
        },
        {
          path: '/demo/filter-sort',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/filterSort.md')
            .default,
          exact: true,
          meta: {
            filePath: 'docs/demo/filterSort.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'filterSort',
                heading: 'filtersort',
              },
            ],
            title: 'filterSort',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'filterSort - rc-select',
        },
        {
          path: '/demo/force-suggest',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/force-suggest.md')
            .default,
          exact: true,
          meta: {
            filePath: 'docs/demo/force-suggest.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'force-suggest',
                heading: 'force-suggest',
              },
            ],
            title: 'force-suggest',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'force-suggest - rc-select',
        },
        {
          path: '/demo/get-popup-container',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/getPopupContainer.md')
            .default,
          exact: true,
          meta: {
            filePath: 'docs/demo/getPopupContainer.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'getPopupContainer',
                heading: 'getpopupcontainer',
              },
            ],
            title: 'getPopupContainer',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'getPopupContainer - rc-select',
        },
        {
          path: '/demo/loading',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/loading.md').default,
          exact: true,
          meta: {
            filePath: 'docs/demo/loading.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'loading',
                heading: 'loading',
              },
            ],
            title: 'loading',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'loading - rc-select',
        },
        {
          path: '/demo/mul-suggest',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/mul-suggest.md')
            .default,
          exact: true,
          meta: {
            filePath: 'docs/demo/mul-suggest.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'mul-suggest',
                heading: 'mul-suggest',
              },
            ],
            title: 'mul-suggest',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'mul-suggest - rc-select',
        },
        {
          path: '/demo/mul-tag-suggest',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/mul-tag-suggest.md')
            .default,
          exact: true,
          meta: {
            filePath: 'docs/demo/mul-tag-suggest.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'mul-tag-suggest',
                heading: 'mul-tag-suggest',
              },
            ],
            title: 'mul-tag-suggest',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'mul-tag-suggest - rc-select',
        },
        {
          path: '/demo/multiple-readonly',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/multiple-readonly.md')
            .default,
          exact: true,
          meta: {
            filePath: 'docs/demo/multiple-readonly.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'multiple-readonly',
                heading: 'multiple-readonly',
              },
            ],
            title: 'multiple-readonly',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'multiple-readonly - rc-select',
        },
        {
          path: '/demo/multiple',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/multiple.md').default,
          exact: true,
          meta: {
            filePath: 'docs/demo/multiple.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'multiple',
                heading: 'multiple',
              },
            ],
            title: 'multiple',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'multiple - rc-select',
        },
        {
          path: '/demo/optgroup',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/optgroup.md').default,
          exact: true,
          meta: {
            filePath: 'docs/demo/optgroup.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'optgroup',
                heading: 'optgroup',
              },
            ],
            title: 'optgroup',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'optgroup - rc-select',
        },
        {
          path: '/demo/option-filter-prop',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/optionFilterProp.md')
            .default,
          exact: true,
          meta: {
            filePath: 'docs/demo/optionFilterProp.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'optionFilterProp',
                heading: 'optionfilterprop',
              },
            ],
            title: 'optionFilterProp',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'optionFilterProp - rc-select',
        },
        {
          path: '/demo/option-label-prop',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/optionLabelProp.md')
            .default,
          exact: true,
          meta: {
            filePath: 'docs/demo/optionLabelProp.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'optionLabelProp',
                heading: 'optionlabelprop',
              },
            ],
            title: 'optionLabelProp',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'optionLabelProp - rc-select',
        },
        {
          path: '/demo/single-animation',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/single-animation.md')
            .default,
          exact: true,
          meta: {
            filePath: 'docs/demo/single-animation.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'single-animation',
                heading: 'single-animation',
              },
            ],
            title: 'single-animation',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'single-animation - rc-select',
        },
        {
          path: '/demo/single',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/single.md').default,
          exact: true,
          meta: {
            filePath: 'docs/demo/single.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'single',
                heading: 'single',
              },
            ],
            title: 'single',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'single - rc-select',
        },
        {
          path: '/demo/single-field-names',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/singleFieldNames.md')
            .default,
          exact: true,
          meta: {
            filePath: 'docs/demo/singleFieldNames.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'singleFieldNames',
                heading: 'singlefieldnames',
              },
            ],
            title: 'singleFieldNames',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'singleFieldNames - rc-select',
        },
        {
          path: '/demo/suggest',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/suggest.md').default,
          exact: true,
          meta: {
            filePath: 'docs/demo/suggest.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'suggest',
                heading: 'suggest',
              },
            ],
            title: 'suggest',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'suggest - rc-select',
        },
        {
          path: '/demo/tags',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/tags.md').default,
          exact: true,
          meta: {
            filePath: 'docs/demo/tags.md',
            updatedTime: 1637312406607,
            slugs: [
              {
                depth: 2,
                value: 'tags',
                heading: 'tags',
              },
            ],
            title: 'tags',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'tags - rc-select',
        },
        {
          path: '/demo/update-option',
          component: require('/Users/jilin/projects/antd/rc-select/docs/demo/update-option.md')
            .default,
          exact: true,
          meta: {
            filePath: 'docs/demo/update-option.md',
            updatedTime: 1637312406606,
            slugs: [
              {
                depth: 2,
                value: 'update-option',
                heading: 'update-option',
              },
            ],
            title: 'update-option',
            group: {
              path: '/demo',
              title: 'Demo',
            },
          },
          title: 'update-option - rc-select',
        },
        {
          path: '/demo',
          meta: {},
          exact: true,
          redirect: '/demo/auto-adjust-dropdown',
        },
      ],
      title: 'rc-select',
      component: (props) => props.children,
    },
  ];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
