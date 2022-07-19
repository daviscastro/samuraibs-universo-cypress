
import signupPage from'../support/pages/signup'

describe('Cadastro', function () {

    context('quando o usuario é novato', function () {
        const user = {
            name: 'Joshh Thomas',
            email: "joshthomas@samuraibs.com",
            password: 'pwd123'
        }

        before(function () {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })

        })

        it('deve cadastrar com sucesso', function () {

            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')     
    })

    context('quando o email já existe', function(){
        const user = {
            name: 'Joshh Thomas',
            email: "joshthomaas@samuraibs.com",
            password: 'pwd123',
            is_provider: true
        }

        before(function(){
            cy.task('removeUser', user.email)
            .then(function (result) {
                console.log(result)
            })
            cy.request(
                'POST',
                'http://localhost:3333/users',
                user
            ).then(function (response) {
                expect(response.status).to.eq(200)
            })
        })

        it('nao deve cadastrar o usuario', function () {

            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')
    
        })
    })

})

    context('quando o email é incorreto', function(){
        const user = {
        name: 'Liz Olsen',
        email: "liza.yahoocom",
        password: 'pwd123'
        }

        it('deve exibir mensagem de alerta', function(){
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.alertHaveText('Informe um email válido')

    
        })
    })
    
    context('quando a senha é curta', function () {

        const passwords = ['1', '2a', 'ab3', 'abc4', 'ab#c5']

        beforeEach(function () {
            signupPage.go()
        })

        passwords.forEach(function (p) {
            it('não deve cadastrar a senha: ' + p, function () {
                const user = {name: 'Joffey Baratheon', email: 'joffrey@samuraibs.com', password: p }
                
                signupPage.form(user)
                signupPage.submit()
            })
        })

        afterEach(function () {
            signupPage.alertHaveText('Pelo menos 6 caracteres')
        })
    })

    context('quando não preencho nenhum dos campos', function(){

        const alertMessages = [
            'Nome é obrigatório',
            'E-mail é obrigatório',
            'Senha é obrigatória'
        ]

        before(function(){
            signupPage.go()
            signupPage.submit()
        })

        alertMessages.forEach(function(alert){
            
            it('deve exibir' + alert.toLowerCase(), function(){
                signupPage.alertHaveText(alert)
            })
        })
    })
})