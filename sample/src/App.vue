<template>
    <div id="app">
        <form class="box">
            <label for="username">Username</label>
            <p class="control">
                <input id="username" class="input" name="username" v-model="user.name">
            </p>

            <label for="password">Password</label>
            <p class="control">
                <vue-password-custom v-model="user.password"
                                     classes="input"
                                     name="vue-password-custom"
                                     id="vue-password-custom"
                                     :score="parseInt(score, 10)"
                                     :user-inputs="[user.name]"
                                     minlength="8"
                                     v-on:input="getStrengthScore"
                                     :strengthMessages="['Must. Do. Better 💩','Yawn 😫','Is that all you\'ve got? 😆','Strong 💪','That\'s bananas! 🍌']"
                >
                </vue-password-custom>
                <span class="help" v-if="user.password.length < 8">Password must be at least 8 characters</span>
                <span class="help" v-if="pwned > 0 && user.password.length > 0">This password matches {{pwned.toLocaleString()}} hacked accounts according to <a href="https://haveibeenpwned.com/" target="_blank">haveibeenpwned.com</a></span>
            </p>

            <p>&nbsp;</p>

            <label for="password-confirm">Confirm Password</label>
            <p class="control">
                <input id="password-confirm"
                       class="input"
                       type="password"
                       name="password-confirm"
                       v-model="user.confirmPassword"
                >
                <span class="help" v-if="!passwordsMatch && user.confirmPassword.length > 0">Passwords do not match</span>
            </p>

            <p>&nbsp;</p>

            <p class="control">
                <button class="button is-primary"
                        :disabled="score < 3 || pwned > 0 || user.password.length < 8 || user.name.length < 1 || !passwordsMatch"
                >Register</button>
            </p>
        </form>
    </div>
</template>

<script>
    import VuePasswordCustom from 'vue-password/dist/custom'
    import PasswordScoringLib from 'haveibeenpwned-zxcvbn-password-scoring-lib'

    export default {
        name: 'app',
        components: {
            VuePasswordCustom
        },
        data () {
            return {
                user: {
                    name: '',
                    password: '',
                    confirmPassword: ''
                },
                score: 0,
                pwned: 0
            }
        },
        computed: {
            passwordsMatch() {
                return this.user.password === this.user.confirmPassword;
            }
        },
        methods: {
            getStrengthScore: function(password, userInputs) {

                var self = this;

                let creds = new PasswordScoringLib({
                    password: password,
                    userInputs: userInputs
                });

                creds.assessPassword({}, function(err, result) {
                    if(err) return;
                    self.score = result.score;
                    self.pwned = result.pwned;
                });
            }
        }
    }
</script>

<style>
    body {
        max-width: 600px;
        margin: 10rem auto;
    }
</style>

