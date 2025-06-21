const PLUGIN_NAME = 'LifecyclePlugin';
const { logYellow, logGreen } = require('../../../tools/log-color.js');

const BANNER_JS = `/**
 * @description: 这是一个自动生成的文件头注释
 * @from: 自定义插件 - webpack/plugins/lifecycle-plugin/index.js
 */`;

class LifecyclePlugin {
  apply(compiler) {
    // 在 webpack 编译生命周期的各个阶段应用钩子
    this.applyCompiler(compiler);

    // 在 compilation 生命周期的各个阶段应用钩子
    this.applyCompilation(compiler);
  }

  /**
   * 应用编译器钩子
   * @param {*} compiler
   */
  applyCompiler(compiler) {
    // beforeRun 这个钩子在编译开始之前被调用。
    compiler.hooks.beforeRun.tap(PLUGIN_NAME, (compilation) => {
      logYellow(`【${PLUGIN_NAME}】beforeRun`);
    });

    // run 这个钩子在编译开始时被调用。
    compiler.hooks.run.tap(PLUGIN_NAME, (compilation) => {
      logYellow(`【${PLUGIN_NAME}】run`);
    });

    // compile 这个钩子在编译开始时被调用。
    compiler.hooks.compile.tap(PLUGIN_NAME, (compilation) => {
      logYellow(`【${PLUGIN_NAME}】compile`);
    });

    // watchRun 这个钩子在监视模式下每次编译之前被调用。
    compiler.hooks.watchRun.tap(PLUGIN_NAME, (compilation) => {
      logYellow(`【${PLUGIN_NAME}】watchRun`);
    });

    // emit 这个钩子在生成资源并输出到目录之前被调用。
    compiler.hooks.emit.tap(PLUGIN_NAME, (compilation) => {
      logYellow(`【${PLUGIN_NAME}】emit`);

      for (const filename in compilation.assets) {
        if (filename.endsWith('.js')) {
          logGreen(`\t处理文件: ${filename}`);
          const originalSource = compilation.assets[filename].source();
          const updatedSource = `${BANNER_JS}\n${originalSource}`;

          compilation.assets[filename] = {
            source: () => updatedSource,
            size: () => Buffer.byteLength(updatedSource, 'utf8'),
          };
        }
      }
    });

    // done 这个钩子在编译完成后被调用。
    compiler.hooks.done.tap(PLUGIN_NAME, (stats) => {
      logYellow(`【${PLUGIN_NAME}】done`);
    });

    // failed 这个钩子在编译过程中发生错误时被调用。
    compiler.hooks.failed.tap(PLUGIN_NAME, (err) => {
      logYellow(`【${PLUGIN_NAME}】failed`, err);
    });
  }

  /**
   * 应用编译钩子
   * @param {*} compiler
   */
  applyCompilation(compiler) {
    // compilation 这个钩子在每次编译开始时被调用。
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      logYellow(`\t【${PLUGIN_NAME}】compilation`);

      // buildModule 这个钩子在编译每个模块时被调用。
      compilation.hooks.buildModule.tap(PLUGIN_NAME, (module) => {
        logYellow(`\t【${PLUGIN_NAME}】compilation.buildModule`);
      });

      // succeedModule 这个钩子在编译每个模块成功时被调用。
      compilation.hooks.succeedModule.tap(PLUGIN_NAME, (module) => {
        logYellow(`\t【${PLUGIN_NAME}】compilation.succeedModule`);
      });

      // failedModule 这个钩子在编译每个模块失败时被调用。
      compilation.hooks.failedModule.tap(PLUGIN_NAME, (module) => {
        logYellow(`\t【${PLUGIN_NAME}】compilation.failedModule`);
      });

      // seal 这个钩子在编译完成后被调用。
      compilation.hooks.seal.tap(PLUGIN_NAME, (compilation) => {
        logYellow(`\t【${PLUGIN_NAME}】compilation.seal`);
      });

      // optimize 这个钩子在优化阶段开始时被调用。
      compilation.hooks.optimize.tap(PLUGIN_NAME, () => {
        logYellow(`\t【${PLUGIN_NAME}】compilation.optimize`);
      });

      // optimizeChunkAssets 这个钩子在优化每个块的资源时被调用。
      compilation.hooks.optimizeChunkAssets.tap(PLUGIN_NAME, (chunks) => {
        logYellow(`\t【${PLUGIN_NAME}】compilation.optimizeChunkAssets`);

        chunks.forEach((chunk) => {
          chunk.files.forEach((file) => {
            logGreen('\t\tChunk:', chunk.name, 'File:', file);
          });
        });
      });
    });
  }
}
module.exports = LifecyclePlugin;
