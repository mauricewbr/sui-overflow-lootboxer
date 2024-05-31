import { useSuiClientQuery } from "@mysten/dapp-kit";

interface CounterProps {
    counterAddress: string;
}
interface UseCounter {
    counter: number;
}

export const useCounter = (props: CounterProps): UseCounter => {
    const { data } = useSuiClientQuery("getObject", {
        id: props.counterAddress,
    });
    console.log(data);
    return { counter: 0 };
};
