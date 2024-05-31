import { usePromptCounter } from '@/hooks/usePromptCounter';

interface MintCounterParams {
    packageAddress: string;
}

export const MintCounter = (props: MintCounterParams) => {
    const { handleUsePromptCounter } = usePromptCounter({
        packageAddress: props.packageAddress,
    });

    let res = handleUsePromptCounter();
    console.log(res);

    return (<></>);
};
