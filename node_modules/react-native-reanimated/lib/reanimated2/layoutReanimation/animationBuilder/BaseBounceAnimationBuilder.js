import { withDelay, withTiming } from '../../animations';
export class BaseBounceAnimationBuilder {
    constructor() {
        this.build = () => {
            throw Error('Unimplemented method in child class.');
        };
    }
    static duration(durationMs) {
        const instance = this.createInstance();
        return instance.duration(durationMs);
    }
    duration(durationMs) {
        this.durationV = durationMs;
        return this;
    }
    static delay(delayMs) {
        const instance = this.createInstance();
        return instance.delay(delayMs);
    }
    delay(delayMs) {
        this.delayV = delayMs;
        return this;
    }
    static withCallback(callback) {
        const instance = this.createInstance();
        return instance.withCallback(callback);
    }
    withCallback(callback) {
        this.callbackV = callback;
        return this;
    }
    getDelayFunction() {
        const delay = this.delayV;
        return delay
            ? withDelay
            : (_, animation) => {
                'worklet';
                return animation;
            };
    }
    getAnimationAndConfig() {
        const duration = this.durationV;
        const type = withTiming;
        const animation = type;
        const config = {};
        if (duration) {
            config.duration = duration;
        }
        return [animation, config];
    }
    static build() {
        const instance = this.createInstance();
        return instance.build();
    }
}
