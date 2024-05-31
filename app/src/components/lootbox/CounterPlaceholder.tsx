import { MintCounter } from './MintCounter';
import { useOwnsCounter } from '@/hooks/useOwnsCounter';

interface CounterPlaceholderParams {
    packageAddress: string;
    address: string;
    registryAddress: string;
}

export const CounterPlaceholder = (props: CounterPlaceholderParams) => {
    const { owns } = useOwnsCounter({
        address: props.address,
        packageAddress: props.packageAddress
    });

    return (
        <>
            {owns ? <></> :
                <MintCounter
                    packageAddress={props.packageAddress}
                />}
        </>
    );
};
