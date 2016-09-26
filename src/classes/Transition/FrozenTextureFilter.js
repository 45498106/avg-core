/**
 * @file        Filter classes
 * @author      Icemic Jia <bingfeng.web@gmail.com>
 * @copyright   2013-2016 Icemic Jia
 * @link        https://www.avgjs.org
 * @license     Apache License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const PIXI = require('pixi.js');

const commonVertex = require(__dirname + '/shaders/common.vert');
const frozenFrag = require(__dirname + '/shaders/prepareTransition.frag');

export default class FrozenTextureFilter extends PIXI.Filter {
  constructor(texture) {
    super(commonVertex, frozenFrag,
        { texture: { type: 'sampler2D', value: PIXI.Texture.EMPTY } });
  }

  setTexture(texture) {
    this.uniformData.texture.value = texture;
    this.uniforms.texture = texture;
  }
}
