import { withDelay, withTiming, withSpring } from '../../animations';
export class LayoutAnimationBuilder {
    constructor() {
        this.build = () => {
            const duration = this.durationV;
            const easing = this.easingV;
            const delay = this.delayV;
            const type = this.type ? this.type : withTiming;
            const damping = this.dampingV;
            const mass = this.massV;
            const stiffness = this.stiffnessV;
            const overshootClamping = this.overshootClampingV;
            const restDisplacementThreshold = this.restDisplacementThresholdV;
            const restSpeedThreshold = this.restSpeedThresholdV;
            const callback = this.callbackV;
            const delayFunction = delay
                ? withDelay
                : (_, animation) => {
                    'worklet';
                    return animation;
                };
            const animation = type;
            const config = {};
            if (type === withTiming) {
                if (easing) {
                    config.easing = easing;
                }
                if (duration) {
                    config.duration = duration;
                }
            }
            else {
                if (damping) {
                    config.damping = damping;
                }
                if (mass) {
                    config.mass = mass;
                }
                if (stiffness) {
                    config.stiffness = stiffness;
                }
                if (overshootClamping) {
                    config.overshootClamping = overshootClamping;
                }
                if (restDisplacementThreshold) {
                    config.restDisplacementThreshold = restDisplacementThreshold;
                }
                if (restSpeedThreshold) {
                    config.restSpeedThreshold = restSpeedThreshold;
                }
            }
            return (values) => {
                'worklet';
                return {
                    initialValues: {
                        originX: values.boriginX,
                        originY: values.boriginY,
                        width: values.bwidth,
                        height: values.bheight,
                    },
                    animations: {
                        originX: delayFunction(delay, animation(values.originX, config)),
                        originY: delayFunction(delay, animation(values.originY, config)),
                        width: delayFunction(delay, animation(values.width, config)),
                        height: delayFunction(delay, animation(values.height, config)),
                    },
                    callback: callback,
                };
            };
        };
    }
    static duration(durationMs) {
        const instance = new LayoutAnimationBuilder();
        return instance.duration(durationMs);
    }
    duration(durationMs) {
        this.durationV = durationMs;
        return this;
    }
    static easing(easingFunction) {
        const instance = new LayoutAnimationBuilder();
        return instance.easing(easingFunction);
    }
    easing(easingFunction) {
        this.easingV = easingFunction;
        return this;
    }
    static delay(durationMs) {
        const instance = new LayoutAnimationBuilder();
        return instance.delay(durationMs);
    }
    delay(durationMs) {
        this.delayV = durationMs;
        return this;
    }
    static springify() {
        const instance = new LayoutAnimationBuilder();
        return instance.springify();
    }
    springify() {
        this.type = withSpring;
        return this;
    }
    static damping(damping) {
        const instance = new LayoutAnimationBuilder();
        return instance.damping(damping);
    }
    damping(damping) {
        this.dampingV = damping;
        return this;
    }
    static mass(mass) {
        const instance = new LayoutAnimationBuilder();
        return instance.mass(mass);
    }
    mass(mass) {
        this.massV = mass;
        return this;
    }
    static stiffness(stiffness) {
        const instance = new LayoutAnimationBuilder();
        return instance.stiffness(stiffness);
    }
    stiffness(stiffness) {
        this.stiffnessV = stiffness;
        return this;
    }
    static overshootClamping(overshootClamping) {
        const instance = new LayoutAnimationBuilder();
        return instance.overshootClamping(overshootClamping);
    }
    overshootClamping(overshootClamping) {
        this.overshootClampingV = overshootClamping;
        return this;
    }
    static restDisplacementThreshold(restDisplacementThreshold) {
        const instance = new LayoutAnimationBuilder();
        return instance.restDisplacementThreshold(restDisplacementThreshold);
    }
    restDisplacementThreshold(restDisplacementThreshold) {
        this.restDisplacementThresholdV = restDisplacementThreshold;
        return this;
    }
    static restSpeedThreshold(r) {
        const instance = new LayoutAnimationBuilder();
        return instance.restSpeedThreshold(r);
    }
    restSpeedThreshold(restSpeedThreshold) {
        this.restSpeedThresholdV = restSpeedThreshold;
        return this;
    }
    static withCallback(callback) {
        const instance = new LayoutAnimationBuilder();
        return instance.withCallback(callback);
    }
    withCallback(callback) {
        this.callbackV = callback;
        return this;
    }
    static build() {
        const instance = new LayoutAnimationBuilder();
        return instance.build();
    }
}
export const Layout = LayoutAnimationBuilder;
