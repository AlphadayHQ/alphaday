import { FC, PropsWithChildren } from "react";
import { useFeatureFlags } from "src/api/hooks";
import { EFeaturesRegistry } from "src/constants";

/**
 * This HOC can be used to sufficiently hide a component if a feature is not allowed.
 * If the feature is allowed, the component will be rendered without making any changes to it.
 *
 * Example:
 * ```ts
 * // MyComponent.tsx
 * export default withFeature(MyComponent, EFeaturesRegistry.MyFeature);
 *
 * // ParentComponent.tsx
 * <MyComponent /> // will be rendered if MyFeature is allowed
 * ```
 *
 * @param WrappedComponent
 * @param featureId
 */
export function withFeature<T>(
    WrappedComponent: FC<T>,
    featureId?: EFeaturesRegistry
): FC<PropsWithChildren<T>> {
    const WithFeature: FC<PropsWithChildren<T>> = (props) => {
        const isFeatureAllowed = useFeatureFlags(featureId);

        if (!isFeatureAllowed) return null;

        return <WrappedComponent {...props} />;
    };

    return WithFeature;
}
