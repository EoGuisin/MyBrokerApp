import { Dimensions } from 'react-native';
import { BaseAnimationBuilder } from '../animationBuilder/BaseAnimationBuilder';
const { width } = Dimensions.get('window');
export class RollInLeft extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return (values) => {
                'worklet';
                return {
                    animations: {
                        originX: delayFunction(delay, animation(values.originX, config)),
                        transform: [
                            { rotate: delayFunction(delay, animation('0deg', config)) },
                        ],
                    },
                    initialValues: {
                        originX: values.originX - width,
                        transform: [{ rotate: '-180deg' }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new RollInLeft();
    }
}
export class RollInRight extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return (values) => {
                'worklet';
                return {
                    animations: {
                        originX: delayFunction(delay, animation(values.originX, config)),
                        transform: [
                            { rotate: delayFunction(delay, animation('0deg', config)) },
                        ],
                    },
                    initialValues: {
                        originX: values.originX + width,
                        transform: [{ rotate: '180deg' }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new RollInRight();
    }
}
export class RollOutLeft extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return (values) => {
                'worklet';
                return {
                    animations: {
                        originX: delayFunction(delay, animation(values.originX - width, config)),
                        transform: [
                            { rotate: delayFunction(delay, animation('-180deg', config)) },
                        ],
                    },
                    initialValues: {
                        originX: values.originX,
                        transform: [{ rotate: '0deg' }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new RollOutLeft();
    }
}
export class RollOutRight extends BaseAnimationBuilder {
    constructor() {
        super(...arguments);
        this.build = () => {
            const delayFunction = this.getDelayFunction();
            const [animation, config] = this.getAnimationAndConfig();
            const delay = this.delayV;
            const callback = this.callbackV;
            return (values) => {
                'worklet';
                return {
                    animations: {
                        originX: delayFunction(delay, animation(values.originX + width, config)),
                        transform: [
                            { rotate: delayFunction(delay, animation('180deg', config)) },
                        ],
                    },
                    initialValues: {
                        originX: values.originX,
                        transform: [{ rotate: '0deg' }],
                    },
                    callback: callback,
                };
            };
        };
    }
    static createInstance() {
        return new RollOutRight();
    }
}
