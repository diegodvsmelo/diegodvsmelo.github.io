// Conteúdo editável do portfólio. Mantenha dados verificáveis e links absolutos.
window.siteData = {
    contactEmail: "diegodvsmelo@gmail.com",
    pt: {
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
    },
    en: {
        skills: [
            { icon: "unity", title: "Unity 2D and 3D", description: "Development of games and interactive experiences for different platforms." },
            { icon: "code", title: "C# and OOP", description: "Object-oriented game logic with clearly defined responsibilities." },
            { icon: "code", title: "C++", description: "Development of systems using object-oriented programming and data structures." },
            { icon: "blocks", title: "Scriptable Objects", description: "Modular skills and systems that make game development easier." },
            { icon: "gamepad", title: "uGUI UI", description: "Building interfaces for projects developed in Unity." },
            { icon: "shader", title: "Unity Shader Graph", description: "A visual development tool used in EITA!." },
            { icon: "flow", title: "Git and GitHub", description: "Version control and collaborative project maintenance." },
            { icon: "gamepad", title: "Systems and game design", description: "Game mechanics, states, progression, economy, and balancing." },
            { icon: "speed", title: "Visual feedback", description: "Particles, squash and stretch, button animations, and value transitions." }
        ],
        projects: [
            {
                title: "Codex of Essence", category: "Team-developed 2D game", period: "Oct 2025 – Dec 2025",
                description: "Desktop and web game developed by a team over eight weeks for the 2D Game Implementation 2025.2 course at CIn.",
                stack: ["Unity", "C#", "Scriptable Objects", "Git/GitHub"],
                link: "https://github.com/diegodvsmelo/Codice-de-Essentia", visual: "codice",
                details: {
                    context: "A project for the 2D Game Implementation 2025.2 course at CIn. The team conceived, organized, and developed a complete game over eight weeks.",
                    role: "Systems development and organizational and creative leadership of the team.",
                    highlights: [
                        {
                            title: "Mechanics and systems",
                            delivery: "Developed ability systems, state management, and interface interactions.",
                            how: "Used Scriptable Objects to modularize functionality.",
                            why: "To speed up development of the systems."
                        },
                        {
                            title: "Team coordination",
                            delivery: "Delegated work, supported the team, and organized weekly activities while creating and refining ideas for the setting, gameplay, and user experience."
                        },
                        {
                            title: "Collaborative version control",
                            delivery: "Created the repository and maintained the project with the team.",
                            how: "Used Git and GitHub for version control.",
                            why: "To improve project organization and workflow."
                        },
                        {
                            title: "Game logic",
                            delivery: "Implemented game logic with a focus on performance and code organization."
                        }
                    ],
                    technologies: ["Unity", "C#", "Scriptable Objects", "Git", "GitHub"],
                    competencies: ["Mechanics development", "State management", "UI", "Modular architecture", "Team leadership", "Code organization"]
                }
            },
            {
                title: "EITA! – Mobile Game", category: "Mobile game · BFI-10 fellowship", period: "Feb 2026 – Sep 2026",
                description: "Environmental education incremental game developed at LaCA²I during the UFPE/FACEPE BFI-10 innovation fellowship.",
                stack: ["Unity", "C#", "UI uGUI", "Scriptable Objects", "Unity Shader Graph"],
                link: "mailto:diegodvsmelo@gmail.com?subject=Interest%20in%20the%20EITA%21%20project", visual: "eita",
                details: {
                    context: "A digital game developed at the Laboratory for the Design and Analysis of Intelligent Artifacts (LaCA²I) during the UFPE/FACEPE BFI-10 fellowship. The initiative covers environmental education, gamification, augmented reality, and accessible information.",
                    role: "Unity developer and BFI-10 innovation fellow.",
                    highlights: [
                        {
                            title: "Core game systems",
                            delivery: "Implemented grid-based building, scalable upgrades, resource generation, quests, research, and modular interfaces for the incremental mobile game.",
                            how: "Organized the architecture using OOP and separation of responsibilities.",
                            why: "To support scalability and make the project easier to maintain."
                        },
                        {
                            title: "Guided tutorials",
                            delivery: "Created tutorials introducing the main mechanics.",
                            how: "Used trigger-driven guided flows.",
                            why: "To guide players through the game's core loop."
                        },
                        {
                            title: "Progression and economy",
                            delivery: "Helped balance levels, progression, and resource income and spending."
                        },
                        {
                            title: "Visual feedback",
                            delivery: "Implemented particles, squash and stretch, button animations, and value transitions.",
                            why: "To improve visual feedback for interactions."
                        }
                    ],
                    technologies: ["Unity", "C#", "UI uGUI", "Scriptable Objects", "Unity Shader Graph"],
                    competencies: ["OOP", "Modular architecture", "Separation of responsibilities", "Progression and economy", "Guided tutorials", "Visual feedback"]
                }
            },
            {
                title: "Capiba Cultural", category: "Cultural gamification", period: "Academic project",
                description: "Gamification concept that encourages people to explore Recife using the Capiba currency.",
                stack: ["Gamification", "Digital product", "UX"],
                link: "https://github.com/henriqesl/capiba-cultural", visual: "capiba",
                details: {
                    context: "An academic cultural gamification project about exploring Recife.",
                    highlights: [
                        { title: "Concept", delivery: "Encourages people to explore Recife using the Capiba currency." }
                    ],
                    technologies: ["Gamification", "Digital product", "UX"],
                    competencies: ["Gamification", "UX"]
                }
            },
            {
                title: "Algorithms and Data Structures", visualTitle: "Itaú Bike Routes", category: "Algorithms and graphs", period: "Academic project",
                description: "Application of the Bellman-Ford algorithm to connect bike stations in Recife with an optimized route.",
                stack: ["Algorithms", "Graphs", "Bellman-Ford"],
                link: "https://github.com/MateusRiba/Projeto-Bellman-Ford", visual: "route",
                details: {
                    context: "An academic algorithms and graphs project applied to bike stations in Recife.",
                    highlights: [
                        { title: "Routing", delivery: "Applied the Bellman-Ford algorithm to connect bike stations with an optimized route." }
                    ],
                    technologies: ["Algorithms", "Graphs", "Bellman-Ford"],
                    competencies: ["Algorithms", "Graphs"]
                }
            },
            {
                title: "Object-Oriented Data Structures", visualTitle: "Sales management", category: "Management system", period: "Academic project",
                description: "C++ CRUD system for managing small grocery store products and tracking sales.",
                stack: ["C++", "OOP", "CRUD"],
                link: "https://github.com/LucasFernandesCS/market-manager-cpp", visual: "market",
                details: {
                    context: "An academic management system project for a small grocery store.",
                    highlights: [
                        { title: "Sales management", delivery: "A C++ CRUD system for managing products and tracking sales." }
                    ],
                    technologies: ["C++", "OOP", "CRUD"],
                    competencies: ["C++", "Object-oriented programming", "CRUD"]
                }
            },
            {
                title: "Portal E-móveis", category: "Web application", period: "Academic project",
                description: "Real estate portal designed to match buyers, sellers, and agents.",
                stack: ["React", "TypeScript", "Express"],
                link: "https://github.com/GabrielNSB007/portal_e-moveis", visual: "homes",
                details: {
                    context: "An academic web application project for the real estate market.",
                    highlights: [
                        { title: "Portal concept", delivery: "Matches buyers, sellers, and agents." }
                    ],
                    technologies: ["React", "TypeScript", "Express"],
                    competencies: ["Web application", "Real estate matchmaking"]
                }
            }
        ]
    }
};
