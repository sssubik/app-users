<template>
    <div>
       <button class="btn btn-primary float-right mt-2" @click="reloadList">Reload</button>
        <h1 class="title">User List</h1>

        <div class="clearfix"></div>

        <h2 v-show="!bcConnected"> Not connected to blockchain.. please wait </h2>

        <h2 v-show="(isLoading && bcConnected)"> Loading...</h2>

        <table class="table table-striped" v-show="!isLoading">
            <thread class="thread-dark">
                <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Address</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                </tr>
            </thread>
            <tbody>
                <tr v-for="user in users">
                    <td>{{ user[0].toNumber() }}</td>
                    <td>{{ user[1] }}</td>
                    <td>{{ toAscii(user[2]) }}</td>
                    <td>{{ user[3] }}</td>
                    <td>{{ toDate( user[4].toNumber() ) }}</td>
                    <td>{{ toDate( user[5].toNumber() ) }}</td>
                </tr>
            </tbody>
    </div>
</template>

<script>
    import mixin from '../libs/mixinViews'

    export default {
        mixins: [mixin],

        data() {
            return {
                users: [],
                isLoading: true,
                bcConnected: false,
                tmoConn: null,
            }
        },
        
        methods: {
            getUserList() {
                if (this.blockchainIsConnected()){
                    this.isLoading = true;
                    clearInterval(this.tmoConn);

                    this.getAllUsers(userProfile => {
                        this.isLoading = false;
                        this.users.push(userProfile)
                    })
                }
            },

             reloadList() {
                this.users = [];

                this.getUserList();
            },

            getAllUsers(callback) {
                window.bc.contract().totalUsers((err, total) => {
                    var tot = 0
                    if (total) tot = total.toNumber()

                    if(tot > 0) {
                        for (var i = 1; i<=tot; i++){
                            window.bc.contract().getUserById.call(i, (error, userProfile) => {
                                callback(userProfile)
                            })
                        }
                    }
                })
            }
        },

          created() {
            // it tries to get the user list from the blockchian once
            // the connection is established
            this.tmoConn = setInterval(() => {
                this.getUserList();
            }, 1000);
        }
    }
</script>