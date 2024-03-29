import { Func } from "../core/func";
import { MousePointer } from "../core/mousePointer";
import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Point } from "../libs/point";
import { Rect } from "../libs/rect";
import { Util } from "../libs/util";

// -----------------------------------------
//
// -----------------------------------------
export class TextItem extends MyDisplay {

  private _inner: HTMLElement;
  public get inner(): HTMLElement {
    return this._inner;
  }

  private _innerPos: Rect = new Rect();
  public get innerPos(): Rect {
    return this._innerPos;
  }

  private _pos: Rect = new Rect();
  public get pos(): Rect {
    return this._pos;
  }

  private _key: number;
  public get key(): number {
    return this._key;
  }

  private _center: Rect = new Rect();
  public get center(): Rect {
    return this._center;
  }

  private _offsetPos: Rect = new Rect();
  private _scale: number = 1;
  private _ease: number = 0.1;


  constructor(opt:any) {
    super(opt)

    this._key = opt.key;

    Tween.set(this.el, {
      position: 'absolute',
      top: 0,
      left: 0,
      overflow: 'hidden',
    });

    this._inner = this.el.querySelector('p') as HTMLElement;
    this._inner.classList.remove('js-text-org');
    this._inner.classList.add('js-text-item-inner');
    Tween.set(this._inner, {
      position: 'absolute',
      top: 0,
      left: 0,
    })

    if(!Util.hit(5)) {
      Tween.set(this._inner, {
        color: Util.randomArr(['#00ffff', '#ff0000'])
      })
    }

    this.useGPU(this._inner);
    this.useGPU(this.el);
  }


  protected _update(): void {
    super._update();

    const mx = MousePointer.instance.x;
    const my = MousePointer.instance.y;

    const test = new Point();
    test.x = this._center.x + this._pos.x;
    test.y = this._center.y + this._pos.y;

    const dx = mx - test.x;
    const dy = my - test.y;
    const d = Math.sqrt(dx * dx + dy * dy);

    const dr = Util.map(d, 1, 0, 0, this._pos.width * Func.val(1.5, 2));
    const range = this._pos.width * 0.012 * Func.val(40, 10);

    const tgX = range * dr * dx * -1
    const tgY = range * dr * dy * -1
    this._offsetPos.x += (tgX - this._offsetPos.x) * this._ease;
    this._offsetPos.y += (tgY - this._offsetPos.y) * this._ease;

    this._scale += (Util.map(dr, 1, 0, 0, 1) - this._scale) * this._ease;

    Tween.set(this._inner, {
      x: this._innerPos.x + this._offsetPos.x * 0,
      y: this._innerPos.y + this._offsetPos.y * 0,
      // scale: this._scale,
      rotateZ: -45
    })
  }

  protected _resize(): void {
    super._resize();
  }
}