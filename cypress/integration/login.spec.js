
import loginPage from '../support/pages/login'
import dashPage from '../support/pages/dash'

describe('login', function () {

    context('quando o usuário é muito bom', function () {

        const user = {
            name: 'Robson Thomaz',
            email: 'robthomaz@samuraibs.com',
            password: 'pwd123',
            is_provider: true
        }

        before(function () {
            
        })

        it('deve logar com sucesso', function () {
            loginPage.go()
            loginPage.form(user)
            loginPage.submit()

            dashPage.header.userLoggedIn(user.name)
        })
    })

    context('quando o usuário é muito bom mas a senha está incorreta', function () {

        let user = {
            name: 'Joffrey Silva',
            email: 'joffrey@samuraibs.com',
            password: 'pwd123',
            is_provider: true
        }

        before(function(){
            cy.postUser(user).then(function(){
                user.password = 'abc123'
            })
        })

        it('deve notificar erro de cedenciais', function(){
            loginPage.go()
            loginPage.form(user)
            loginPage.submit()

            const message = 'Ocorreu um erro ao fazer login, verifique suas credenciais.'
            
            loginPage.toast.shouldHaveText(message)

        })
    })

    context('quando o formato do email é inválido', function(){

        const emails = [
            'papito.com.br',
            'yahoo.com',
            'gmail.com',
            '@',
            'papito@',
            '111',
            '&*^&^&*',
            'xpto123'
        ]
        before(function(){
            loginPage.go()
        })

        emails.forEach(function(email) {
            it('não deve logar com o email: ' + email, function(){
                const user = {email: email, password: 'pwd123'}

                loginPage.form(user)
                loginPage.submit()
                loginPage.alert.haveText('Informe um email válido')

            
            })
        })
    })

    context('quando não preencho nenhum dos campos', function(){

        const alertMessages = [
            'E-mail é obrigatório',
            'Senha é obrigatória'
        ]

        before(function(){
            loginPage.go()
            loginPage.submit()
        })

        alertMessages.forEach(function(alert){
            
            it('deve exibir ' + alert.toLowerCase(), function(){
                loginPage.alert.haveText(alert)
            })
        })
    })
})