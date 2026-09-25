// Conteúdo editável do portfólio. Mantenha dados verificáveis e links absolutos.
window.siteData = {
    contactEmail: "diegodvsmelo@gmail.com",
    skills: [
        { icon: "unity", title: "Unity 2D e 3D", description: "Desenvolvimento de jogos e experiências interativas para diferentes plataformas." },
        { icon: "code", title: "C# e POO", description: "Lógica de jogo orientada a objetos, com responsabilidades bem definidas." },
        { icon: "code", title: "C++", description: "Desenvolvimento de sistemas com orientação a objetos e estruturas de dados." },
        { icon: "blocks", title: "Scriptable Objects", description: "Modularização de habilidades e sistemas para facilitar a construção do jogo." },
        { icon: "gamepad", title: "UI uGUI", description: "Construção de interfaces nos projetos desenvolvidos em Unity." },
        { icon: "shader", title: "Unity Shader Graph", description: "Ferramenta da stack visual utilizada no desenvolvimento do EITA!." },
        { icon: "flow", title: "Git e GitHub", description: "Controle de versão e manutenção colaborativa de projetos." },
        { icon: "gamepad", title: "Sistemas e game design", description: "Mecânicas, estados, progressão, economia e balanceamento de jogos." },
        { icon: "speed", title: "Feedback visual", description: "Partículas, squash and stretch, animações de botões e transições de valores." }
    ],
    projects: [
        {
            title: "Códice de Essentia", category: "Jogo 2D em equipe", period: "Out 2025 – Dez 2025",
            description: "Jogo desktop e web desenvolvido em equipe durante oito semanas na disciplina Implementação de Jogos 2D 2025.2 do CIn.",
            stack: ["Unity", "C#", "Scriptable Objects", "Git/GitHub"],
            link: "https://github.com/diegodvsmelo/Codice-de-Essentia", visual: "codice",
            details: {
                context: "Projeto da disciplina Implementação de Jogos 2D 2025.2 no CIn, com o objetivo de idealizar, organizar e desenvolver um jogo completo em equipe ao longo de oito semanas.",
                role: "Desenvolvimento de sistemas e liderança organizacional e criativa da equipe.",
                highlights: [
                    {
                        title: "Mecânicas e sistemas",
                        delivery: "Desenvolvimento de sistemas de habilidades, controle de estados e interação com a interface.",
                        how: "Uso de Scriptable Objects para modularizar funções.",
                        why: "Dar agilidade à construção dos sistemas."
                    },
                    {
                        title: "Coordenação da equipe",
                        delivery: "Delegação, apoio e organização semanal das atividades, com criação e melhoria de ideias de contexto, gameplay e experiência do usuário."
                    },
                    {
                        title: "Versionamento colaborativo",
                        delivery: "Criação do repositório e manutenção do projeto em equipe.",
                        how: "Controle de versão com Git e GitHub.",
                        why: "Melhorar a organização e o funcionamento do projeto."
                    },
                    {
                        title: "Lógica de jogo",
                        delivery: "Implementação de lógica de jogo com foco em desempenho e organização de código."
                    }
                ],
                technologies: ["Unity", "C#", "Scriptable Objects", "Git", "GitHub"],
                competencies: ["Desenvolvimento de mecânicas", "Controle de estados", "UI", "Arquitetura modular", "Liderança de equipe", "Organização de código"]
            }
        },
        {
            title: "EITA! – Jogo Mobile", category: "Jogo mobile · Bolsa BFI-10", period: "Fev 2026 – Set 2026",
            description: "Jogo incremental de educação ambiental desenvolvido no LaCA²I durante a bolsa de fomento à inovação BFI-10 da UFPE/FACEPE.",
            stack: ["Unity", "C#", "UI uGUI", "Scriptable Objects", "Unity Shader Graph"],
            link: "mailto:diegodvsmelo@gmail.com?subject=Interesse%20no%20projeto%20EITA", visual: "eita",
            details: {
                context: "Jogo digital desenvolvido no Laboratório de Concepção e Análise de Artefatos Inteligentes (LaCA²I) durante a bolsa BFI-10 da UFPE/FACEPE. A iniciativa aborda educação ambiental, gamificação, realidade aumentada e acessibilidade informacional.",
                role: "Desenvolvedor Unity e bolsista de fomento à inovação BFI-10.",
                highlights: [
                    {
                        title: "Sistemas centrais do jogo",
                        delivery: "Implementação de construção em grade, upgrades escaláveis, geração de recursos, quests, pesquisas e interfaces modulares para o jogo mobile incremental.",
                        how: "Organização da arquitetura com POO e separação de responsabilidades.",
                        why: "Permitir escalabilidade e facilitar a manutenção do projeto."
                    },
                    {
                        title: "Tutoriais guiados",
                        delivery: "Criação de tutoriais para apresentar as principais mecânicas.",
                        how: "Fluxos guiados por gatilhos.",
                        why: "Conduzir o jogador pelo ciclo central do jogo."
                    },
                    {
                        title: "Progressão e economia",
                        delivery: "Apoio ao balanceamento de níveis, progressão e relações de ganho e gasto de recursos."
                    },
                    {
                        title: "Feedback visual",
                        delivery: "Implementação de partículas, squash and stretch, animações de botões e transições de valores.",
                        why: "Melhorar o feedback visual das interações."
                    }
                ],
                technologies: ["Unity", "C#", "UI uGUI", "Scriptable Objects", "Unity Shader Graph"],
                competencies: ["POO", "Arquitetura modular", "Separação de responsabilidades", "Progressão e economia", "Tutoriais guiados", "Feedback visual"]
            }
        },
        {
            title: "Capiba Cultural", category: "Gamificação cultural", period: "Projeto acadêmico",
            description: "Proposta de gamificação que incentiva a descoberta do Recife por meio da moeda Capiba.",
            stack: ["Gamificação", "Produto digital", "UX"],
            link: "https://github.com/henriqesl/capiba-cultural", visual: "capiba",
            details: {
                context: "Projeto acadêmico de gamificação cultural sobre a descoberta do Recife.",
                highlights: [
                    { title: "Proposta", delivery: "Incentivo à descoberta do Recife por meio da moeda Capiba." }
                ],
                technologies: ["Gamificação", "Produto digital", "UX"],
                competencies: ["Gamificação", "UX"]
            }
        },
        {
            title: "Algoritmo e Estrutura de Dados", visualTitle: "Rotas de Bike Itaú", category: "Algoritmos e grafos", period: "Projeto acadêmico",
            description: "Aplicação de Bellman-Ford para conectar estações de bike do Recife em uma rota otimizada.",
            stack: ["Algoritmos", "Grafos", "Bellman-Ford"],
            link: "https://github.com/MateusRiba/Projeto-Bellman-Ford", visual: "route",
            details: {
                context: "Projeto acadêmico de algoritmos e grafos aplicado a estações de bike do Recife.",
                highlights: [
                    { title: "Roteamento", delivery: "Aplicação do algoritmo de Bellman-Ford para conectar estações de bike em uma rota otimizada." }
                ],
                technologies: ["Algoritmos", "Grafos", "Bellman-Ford"],
                competencies: ["Algoritmos", "Grafos"]
            }
        },
        {
            title: "Estrutura de Dados Orientada a Objetos", visualTitle: "Gestão de vendas", category: "Sistema de gestão", period: "Projeto acadêmico",
            description: "Sistema CRUD em C++ para gerenciar produtos de mercadinho e acompanhar o fluxo de vendas.",
            stack: ["C++", "POO", "CRUD"],
            link: "https://github.com/LucasFernandesCS/market-manager-cpp", visual: "market",
            details: {
                context: "Projeto acadêmico de um sistema de gestão para mercadinho.",
                highlights: [
                    { title: "Gestão de vendas", delivery: "Sistema CRUD em C++ para gerenciar produtos e acompanhar o fluxo de vendas." }
                ],
                technologies: ["C++", "POO", "CRUD"],
                competencies: ["C++", "Orientação a objetos", "CRUD"]
            }
        },
        {
            title: "Portal E-móveis", category: "Aplicação web", period: "Projeto acadêmico",
            description: "Portal imobiliário com proposta de matchmaking entre compradores, vendedores e corretores.",
            stack: ["React", "TypeScript", "Express"],
            link: "https://github.com/GabrielNSB007/portal_e-moveis", visual: "homes",
            details: {
                context: "Projeto acadêmico de aplicação web para o mercado imobiliário.",
                highlights: [
                    { title: "Proposta do portal", delivery: "Matchmaking entre compradores, vendedores e corretores." }
                ],
                technologies: ["React", "TypeScript", "Express"],
                competencies: ["Aplicação web", "Matchmaking imobiliário"]
            }
        }
    ]
};
