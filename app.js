const vm = new Vue({
  el: "#app",
  data: {
    produtos: [],
    produto: false,
    carrinho: [],
    carrinhoAtivo: false,
    mensagemAlerta: "item Adicionado",
    alertaAtivo: false,
  },
  filters: {
    numberPrice(valor) {
      return valor.toLocaleString("pt-br", { style: "currency", currency: "BRL" })
    }
  },
  computed: {
    carrinhoTotal() {
      let total = 0
      if (this.carrinho.length) {
        this.carrinho.forEach(item => {
          total += item.preco
        });
      }
      return total
    }
  },
  methods: {
    fetchProdutos() {
      fetch("./api/produtos.json")
        .then(r => r.json())
        .then(r => {
          this.produtos = r;
          // console.log(this.produtos)
        })
    },

    
    fetchProduto(id) {
      fetch(`./api/produtos/${id}/dados.json`)
      .then(r => r.json())
      .then(r => {
        this.produto  = r;
      })
    },

    addItems() {
    this.produto.estoque--;
    const {id, nome, preco}  = this.produto;
    this.carrinho.push({id, nome, preco})
    this.alerta(`${nome} foi adicionado ao carrinho`)
    },
    removeItems(index) {
      this.carrinho.splice(index, 1)
    },
    checarLocalStorage() {
      if (window.localStorage.carrinho) {
        this.carrinho = JSON.parse(window.localStorage.carrinho)
      }
    },
    alerta(mensagem) {
      this.mensagemAlerta = mensagem;
      this.alertaAtivo = true
      setTimeout(() =>{
        this.alertaAtivo = false;
      }, 1500)
    },
    router() {
      const hash = document.location.hash;
      if (hash)
        this.fetchProduto(hash.replace("#", ""));
    },
    compararEstoque() {
     const items = this.carrinho.filter(({id}) => id === this.produto.id)
      this.produto.estoque -= items.length;
    }
  },
  watch: {
    carrinho() {
      window.localStorage.carrinho = JSON.stringify(this.carrinho)
    },
    produto() {
      document.title = this.produto.nome || "Techno";
      const hash = this.produto.id || "";
      history.pushState(null, null, `#${hash}`);
      if (this.produto) {
        this.compararEstoque();
      }
    },
  },
  created() {
    this.fetchProdutos()
    this.checarLocalStorage()
    this.router()
  }

});