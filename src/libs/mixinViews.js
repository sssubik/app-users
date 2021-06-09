import BcExplorer from './BcExplorer'
import UsersContract from '../assets/Users.json'

export default {
    data() {
        return {
            bcConnected: false,
            bcConnectionError: false,
            errorConnectionMessage: null,
            bcSmartContractAddressError: false
        }
    },

    created(){
        this.init()
    },

    methods: {
        init(){
            if(window.bc == undefined){
                window.bc = new BcExplorer;

                window.bc.initWithContractJson(UsersContract,'http://127.0.0.1:8545')
                .then((error) => {
                    if (error) {
                        this.bcConnected = false;

                        this.showConnectionErrorMessage(error);
                    }else {

                        this.isRegistered()
                        .then(res => {
                            this.bcConnectionError = false;
                            this.bcConnected = this.blockchainIsConnected()
                        })
                        .catch(error => {
                            this.showConnectionErrorMessage(error)
                            this.bcSmartContractAddressError = true
                        })
                    }
                }).catch(error => this.showConnectionErrorMessage(error))
            }
        },

        isRegistered() {
            return new Promise((resolve,reject) => {
                window.bc.getMainAccount()
                .then(account => {
                    window.bc.contract.isRegisterd({from: account}, (error, res) => {
                        if (error) reject(error)
                        resolve(res)
                    })
                })
                .catch(error => reject(error))
            })
        },

        showConnectionErrorMessage(error = null){
            this.bcConnectionError = true

            if (error) console.log(error)

            if (error && error.message){
                this.errorConnectionMessage = error.message
            }
        },

        blockchainIsConnected() {
            this.bcConnected = ((window.bc != undefined) && window.bc.isConnected())
            return this.bcConnected
        },
        toAscii(bytesStr) {
            return window.bc.toAscii(bytesStr);
        },

        /**
         * Transform a timestamp number to date.
         *
         * @param {numeric} bytesStr
         * @return {string}
         */
        toDate(timestamp) {
            return new Date(timestamp * 1000).toISOString();
        }


    }
}