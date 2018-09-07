module.exports = function(app) {

    app.post("/cartao/autorizar",function(req, res) {
        const cartao = req.body;

        req.assert("numero", "Número é obrigatório e deve ter 16 caracteres.").notEmpty().len(16,16);
        req.assert("bandeira", "Bandeira do cartão é obrigatória.").notEmpty();
        req.assert("ano_expiracao", "Ano de expiração é obrigatório e deve ter 4 caracteres.").notEmpty().len(4,4);
        req.assert("mes_expiracao", "Mês de expiração é obrigatório e deve ter 2 caracteres").notEmpty().len(2,2);
        req.assert("cvv", "CVV é obrigatório e deve ter 3 caracteres").notEmpty().len(3,3);

        const errors = req.validationErrors();

        if (errors){
          res.status(400).send(errors);
          return;
        }
        cartao.status = 'AUTORIZADO';

        const response = {
          dados_do_cartao: cartao,
        }

        res.status(201).json(response);
        return;
    });
  }