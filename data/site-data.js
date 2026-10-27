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
            }
        ]
    }
};

// Project information and credits supplied by the project owner.
for (const [language, content] of Object.entries({
    pt: {
        category: "Tower defense 3D", period: "Web",
        description: "Dino Force é um tower defense 3D inspirado em Super Sentai, com torres de dinossauros robóticos e visual low poly estilizado. Construa suas defesas, desbloqueie melhorias e combine três tipos de torres para formar poderosos Megazords.",
        controls: "Mouse",
        status: "Terceira de nove semanas de desenvolvimento",
        credits: "Kenney — Game Icons, Sci-fi Sounds, Impact Sounds e Interface Sounds. Licença: Creative Commons Zero (CC0). Uso livre em projetos pessoais, educacionais e comerciais. A atribuição é opcional.",
        creditsUrl: "https://www.kenney.nl/", licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/"
    },
    en: {
        category: "3D tower defense", period: "Web",
        description: "Dino Force is a 3D tower defense inspired by Super Sentai, featuring robotic dinosaur towers and stylized low poly visuals. Build your defenses, unlock upgrades, and combine three tower types to form powerful Megazords.",
        controls: "Mouse",
        status: "Third of nine weeks of development",
        credits: "Kenney — Game Icons, Sci-fi Sounds, Impact Sounds and Interface Sounds. License: Creative Commons Zero (CC0). Free to use in personal, educational and commercial projects. Attribution is optional.",
        creditsUrl: "https://www.kenney.nl/", licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/"
    }
})) {
    window.siteData[language].projects.unshift({
        title: "DinoForce", visual: "dinoforce", ...content,
        stack: ["Unity", "C#", "WebGL", "Scriptable Objects", "Unity Shaders", "Unity uGUI"],
        repositoryDisabled: true,
        link: "https://github.com/diegodvsmelo/Jogos-Digitais-26.2"
    });
}
