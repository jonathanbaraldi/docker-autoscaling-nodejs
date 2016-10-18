# Docker-compose scaling web service demo
Uma pequena demo de como usar o docker-compose para criar serviços conectados a um balanceador de carga e um banco de dados Redis. 

# Instalação
Você deve ter o Docker instalado. [Docker](https://docs.docker.com/installation/) e o Docker Compose [Docker Compose](https://docs.docker.com/compose/install/). 

Para começar, vamos clonar o projeto para seu host Docker. Crie um diretório no seu host. O nome dos webservices serão parecidos com o diretório que você criou, como por exemplo, se o nome da pasta for teste,  os serviços ficarão como teste-web, teste-lb, teste-redis, etc. E quando você escalar, também pode chamar pelo nome do serviço.

    git clone https://github.com/jonathanbaraldi/docker-autoscaling-nodejs.git

# Como se preparar para rodar

Uma vez que você clonou o projeto para seu host, podemos começar.
Navegue até o diretório e começe:

    cd docker-autoscaling-nodejs
    cd node
    docker build -t <your user docker hub>/docker-autoscaling-nodejs .
    docker build -t jonathanbaraldi/docker-autoscaling-nodejs .

    docker-compose up -d

O comando do docker-compose irá fazer o pull de imagens do Docker hub e então linkar elas juntas baseadas nas informações dentro do arquivo docker-compose.yml. Isto irá criar portas, links entre os containers, e configurar aplicações conforme requerido. Após o comando completar, nós podemos agora ver o status do nosso stack.

    docker-compose ps

Verificar se nossos serviços estão rodando fazendo um curl no ip que vemos ou mesmo acessando no browser. Você irá notar que cada vez que roda os comandos é exibido o número de vezes que a página foi vista, armazenado no Redis. Um contador incremental. O hostname também coloquei para exibir.

###Curling da command line
    curl 0.0.0.0

    {   
        "data":"API chamada  1 vezes!",
        "hostname":"b017349a850a"
    }


# Escalando
Agora vem a parte divertida do compose que é escalar. Vamos escalar nosso web service de 1 container para 5 containers. Isto irá escalar nossos containers do web service. Nós agora devemos rodar um update no nosso stack para que o balanceador de carga seja informado sobre os novos containers de webservices.

    docker-compose scale web=5
    
Agora rode novamente o curl para ver o número crescendo, e também trocando o nome do hostname. Para ter um entendimento mais profundo dos logs e o que está acontecendo no stack, cada vez que seus serviços são acessados

    docker-compose logs
    
{"data":"API chamada  4 vezes!","hostname":"f7c46b544564"}jon:autoscaling-node jonathandiasbaraldi$ curl 192.168.99.100
{"data":"API chamada  5 vezes!","hostname":"b017349a850a"}jon:autoscaling-node jonathandiasbaraldi$ curl 192.168.99.100
{"data":"API chamada  6 vezes!","hostname":"2666e67dc22f"}jon:autoscaling-node jonathandiasbaraldi$ curl 192.168.99.100
{"data":"API chamada  7 vezes!","hostname":"bcda20326df5"}jon:autoscaling-node jonathandiasbaraldi$ curl 192.168.99.100
{"data":"API chamada  8 vezes!","hostname":"b8657ee744e1"}jon:autoscaling-node jonathandiasbaraldi$ curl 192.168.99.100


# Versão 2 do Compose File

A versão 2 do docker-compose já está disponível a algum tempo. Para poder usar os comandos da v2, as mudanças são muito poucas. 

Usamos o projeto HAProxy da dockercloud. Um benefício por rodar o HAProxy da Dockercloud é que ele automaticamente detecta o que está vindo e indo dos containers e não requer nenhuma mudança. Adicionalmente, também é compatível com Docker Swarm.

Mudanças adicionais na v2 do compose incluem overlay de rede. Agora os containers tem redes na exterios e interiores. Isto permite fazer VLAN em como os containers se conectam uns com os outros. Por exemplo, Front Networks são públicas enquanto as Back Networks são apenas para tráfego interno entre as aplicações e os bancos de dados.  

Rode o comando a seguir para validar o docker-compose e rodar. 

    docker-compose -f docker-compose.yml up 
