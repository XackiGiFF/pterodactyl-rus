import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import { ServerContext } from '@/state/server';

const TransferListener = () => {
    const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
    const getServer = ServerContext.useStoreActions(actions => actions.server.getServer);
    const setServerFromState = ServerContext.useStoreActions(actions => actions.server.setServerFromState);

    // Listen for the transfer status event so we can update the state of the server.
    useWebsocketEvent('transfer status', (status: string) => {
        if (status === 'starting') {
            setServerFromState(s => ({ ...s, isTransferring: true }));
            return;
        }

        if (status === 'failure') {
            setServerFromState(s => ({ ...s, isTransferring: false }));
            return;
        }

        if (status !== 'success') {
            return;
        }

        // Refresh the server's information as it's node and allocations were just updated.
        getServer(uuid).catch(error => console.error(error));
    });

    return null;
};

export default TransferListener;
