import { BaseAnimationBuilder } from '../animationBuilder/BaseAnimationBuilder';
export class StretchInX extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return () => {
                'worklet';
                return {
                    animations: {
                        transform: [{ scaleX: delayFunction(delay, animation(1, config)) }],
                    },
                    initialValues: {
                        transform: [{ scaleX: 0 }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new StretchInX();
    }
}
export class StretchInY extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return () => {
                'worklet';
                return {
                    animations: {
                        transform: [{ scaleY: delayFunction(delay, animation(1, config)) }],
                    },
                    initialValues: {
                        transform: [{ scaleY: 0 }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new StretchInY();
    }
}
export class StretchOutX extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return () => {
                'worklet';
                return {
                    animations: {
                        transform: [{ scaleX: delayFunction(delay, animation(0, config)) }],
                    },
                    initialValues: {
                        transform: [{ scaleX: 1 }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new StretchOutX();
    }
}
export class StretchOutY extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return () => {
                'worklet';
                return {
                    animations: {
                        transform: [{ scaleY: delayFunction(delay, animation(0, config)) }],
                    },
                    initialValues: {
                        transform: [{ scaleY: 1 }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new StretchOutY();
    }
}
