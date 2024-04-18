import { Link } from "react-router-dom"
import { BehaviorSubject } from "rxjs"
import { useAppDispatch, useAppSelector } from "../../hook/store.hook"
import { useEffect, useState } from "react"
import { setWalletAddress } from "../../store/wallet.slice"
import detectEthereumProvider from "@metamask/detect-provider"
import { formatAccount } from "../../helper/account.helper"

interface HeaderProps {
    sidebarSubject: BehaviorSubject<boolean>
}

export const Header = ({ sidebarSubject }: HeaderProps) => {
    const [provider, setHasProvider] = useState<boolean | null>(null)
    const dispatch = useAppDispatch();
    const address = useAppSelector(state => state.address)
    const onPressConnectWallet = () => {
        sidebarSubject.next(true)
    }

    useEffect(() => {
        const refreshAccounts = (accounts: any) => {                /* New */
            if (accounts.length > 0) {                                /* New */
                dispatch(setWalletAddress(accounts[0]))                                  /* New */
            } else {                                                  /* New */
                dispatch(setWalletAddress(''))                      /* New */
            }                                                         /* New */
        }                                                           /* New */

        const getProvider = async () => {
            const provider = await detectEthereumProvider({ silent: true })
            setHasProvider(Boolean(provider))

            if (provider) {                                           /* New */
                const accounts = await window?.ethereum?.request(         /* New */
                    { method: 'eth_accounts' }                            /* New */
                )                                                       /* New */
                refreshAccounts(accounts)                               /* New */
                window?.ethereum?.on('accountsChanged', refreshAccounts)  /* New */
            }                                                         /* New */
        }

        getProvider()
        return () => {                                              /* New */
            window.ethereum?.removeListener('accountsChanged', refreshAccounts)
        }                                                           /* New */
    }, [])

    return (
        <div className="flex flex-row flex-1 items-center justify-between fixed top-0 left-0 w-full bg-slate-800 py-5 z-[100]">
            <div className="flex flex-row px-6">
                <Link to={'/'} className="text-white font-medium text-xl mr-6">Bridge</Link>
                <Link to={'/swap'} className="text-white font-medium text-xl mr-6">Swap</Link>
                <Link to={'/tokens'} className="text-white font-medium text-xl mr-6">Tokens</Link>
                <Link to={'/pool'} className="text-white font-medium text-xl mr-6">Pool</Link>
                <Link to={'/faucet'} className="text-white font-medium text-xl mr-2">Faucet</Link>
            </div>
            <div className="flex justify-center items-center bg-orange-600 text-white py-2 rounded-full px-3 mr-4 cursor-pointer max-w-[200px] truncate font-medium" onClick={onPressConnectWallet}><p className=" truncate">{address ? formatAccount(address) : 'Connect wallet'}</p></div>
        </div>

    )
}