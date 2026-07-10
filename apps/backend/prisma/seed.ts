/**
 * Seed Lasylab — données de démarrage extraites du design de référence
 * (Lasylab App.dc.html) : matières, leçon "Le Discriminant", quiz de
 * philosophie, stories, activités/épreuves, badges, et un élève de démo.
 *
 * Idempotent : peut être relancé (upsert / deleteMany ciblés).
 */
import { ActivityCategory, NodeKind, PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { SUBJECTS } from '@lasylab/shared';

const prisma = new PrismaClient();

async function seedSubjects() {
  for (const [i, s] of SUBJECTS.entries()) {
    await prisma.subject.upsert({
      where: { id: s.id },
      update: { name: s.name, short: s.short, color: s.color, barColor: s.barColor, order: i },
      create: { id: s.id, name: s.name, short: s.short, color: s.color, barColor: s.barColor, order: i },
    });
  }
  console.log(`✓ ${SUBJECTS.length} matières`);
}

async function seedMaths() {
  // Nœud 0 : leçon d'introduction "Le Discriminant" (5 diapositives + cours)
  const slides = [
    { big: 'Le Discriminant', sub: "ici c'est une vidéo qui défile de moins de 3 min" },
    { big: 'Δ = b² − 4ac', sub: "On calcule d'abord le discriminant." },
    { big: 'Δ > 0', sub: 'Deux solutions réelles distinctes.' },
    { big: 'Δ = 0', sub: 'Une seule solution (racine double).' },
    { big: 'Δ < 0', sub: 'Aucune solution réelle.' },
  ];
  const body = [
    'Le discriminant, noté Δ (delta), permet de connaître le nombre de solutions',
    "d'une équation du second degré de la forme a·x² + b·x + c = 0.",
    '',
    'On le calcule avec la formule : Δ = b² − 4ac.',
    '',
    'Son signe te renseigne directement :',
    '• Δ > 0 → deux solutions réelles distinctes',
    '• Δ = 0 → une solution unique (racine double)',
    '• Δ < 0 → aucune solution réelle',
  ].join('\n');

  // Remplace la leçon existante pour rester idempotent.
  await prisma.lesson.deleteMany({ where: { subjectId: 'maths', nodeIndex: 0 } });
  await prisma.lesson.create({
    data: {
      subjectId: 'maths',
      nodeIndex: 0,
      kind: NodeKind.INTRO,
      title: 'Le Discriminant',
      body,
      slides: { create: slides.map((s, order) => ({ ...s, order })) },
    },
  });

  // Nœud 1 : quiz sur le discriminant
  await prisma.quiz.deleteMany({ where: { subjectId: 'maths', nodeIndex: 1 } });
  await prisma.quiz.create({
    data: {
      subjectId: 'maths',
      nodeIndex: 1,
      title: 'Quiz — Le Discriminant',
      questions: {
        create: [
          { order: 0, question: 'Quelle est la formule du discriminant ?', options: ['b² − 4ac', '2ab − c', 'a² + b²', 'b² + 4ac'], correctIndex: 0 },
          { order: 1, question: 'Si Δ > 0, combien y a-t-il de solutions réelles ?', options: ['Aucune', 'Une', 'Deux', 'Une infinité'], correctIndex: 2 },
          { order: 2, question: 'Si Δ = 0, la solution est…', options: ['Impossible', 'Une racine double', 'Deux racines', 'Un nombre complexe'], correctIndex: 1 },
        ],
      },
    },
  });
  console.log('✓ Maths : leçon "Le Discriminant" + quiz');
}

async function seedPhilosophie() {
  // Nœud 0 : introduction
  await prisma.lesson.deleteMany({ where: { subjectId: 'philosophie', nodeIndex: 0 } });
  await prisma.lesson.create({
    data: {
      subjectId: 'philosophie',
      nodeIndex: 0,
      kind: NodeKind.INTRO,
      title: 'Introduction à la philosophie',
      body: "La philosophie, « amour de la sagesse », est l'art de se poser des questions et de raisonner pour mieux comprendre le monde et soi-même.",
      slides: {
        create: [
          { order: 0, big: 'La philosophie', sub: "L'amour de la sagesse — philein (aimer) + sophia (sagesse)." },
          { order: 1, big: 'Se poser des questions', sub: 'Douter, interroger, raisonner : le point de départ.' },
          { order: 2, big: '« Connais-toi toi-même »', sub: 'La formule inscrite au temple de Delphes.' },
        ],
      },
    },
  });

  // Nœud 1 : quiz de philosophie (identique au mock)
  await prisma.quiz.deleteMany({ where: { subjectId: 'philosophie', nodeIndex: 1 } });
  await prisma.quiz.create({
    data: {
      subjectId: 'philosophie',
      nodeIndex: 1,
      title: 'Quiz — Philosophie',
      questions: {
        create: [
          { order: 0, question: 'Que signifie le mot « philosophie » ?', options: ["L'amour de la sagesse", 'La peur du savoir', 'La science des nombres', "L'art de bien parler"], correctIndex: 0 },
          { order: 1, question: 'Qui a inventé le mot « philosophie » ?', options: ['Socrate', 'Platon', 'Pythagore', 'Aristote'], correctIndex: 2 },
          { order: 2, question: '« Philein » veut dire…', options: ['Aimer', 'Savoir', 'Douter', 'Écrire'], correctIndex: 0 },
        ],
      },
    },
  });
  console.log('✓ Philosophie : introduction + quiz');
}

async function seedStories() {
  const stories = [
    { bg: 'linear-gradient(165deg,#29ABE2,#1E8FC4)', tag: 'MATHS · Astuce', title: 'Le Discriminant', text: "Vidéo de moins de 3 min : Δ = b² − 4ac, et ce que son signe t'apprend." },
    { bg: 'linear-gradient(165deg,#5BC406,#3f9a02)', tag: 'SVT · Le saviez-vous', title: 'La photosynthèse', text: 'Comment les plantes fabriquent leur nourriture avec la lumière du soleil.' },
    { bg: 'linear-gradient(165deg,#F6A623,#e08a0c)', tag: 'PHILO · Citation', title: '« Connais-toi toi-même »', text: "L'histoire de cette phrase gravée au temple de Delphes, expliquée simplement." },
    { bg: 'linear-gradient(165deg,#7C6FE8,#5849c4)', tag: 'INFO · Défi', title: 'Ta 1re variable', text: 'Écris ta première variable en 1 ligne de code. Prêt à relever le défi ?' },
  ];
  await prisma.story.deleteMany({});
  await prisma.story.createMany({ data: stories.map((s, order) => ({ ...s, order })) });
  console.log(`✓ ${stories.length} stories`);
}

async function seedActivities() {
  const polynomeBody = [
    'Étapes à suivre pour factoriser un polynôme',
    '',
    'Les étapes dépendent du nombre de termes du polynôme. De façon générale, il convient de toujours s\'assurer que le polynôme est factorisé à sa forme la plus complète ; il peut arriver que plus d\'une méthode soit effectuée pour un même polynôme.',
    '',
    'Cas : binôme',
    'Lorsque l\'expression à factoriser est un binôme, il est préférable de suivre les étapes suivantes :',
    '',
    'Règle',
    'Effectuer une mise en évidence simple, si c\'est possible.',
    'Si le signe entre les deux termes du binôme est une soustraction, vérifier s\'il est possible de faire une différence de carrés.',
  ].join('\n');

  const activities = [
    { category: ActivityCategory.METHODE, title: 'MÉTHODES', subjectLabel: 'MATHS', body: polynomeBody },
    { category: ActivityCategory.DEFINITION, title: 'HISTOIRE Chap 12', subjectLabel: 'HISTOIRE' },
    { category: ActivityCategory.DEFINITION, title: 'LEÇONS 1 - 2 - 3', subjectLabel: 'SCIENCE' },
    { category: ActivityCategory.EPREUVE, title: '2022-2023', subjectLabel: 'FRANÇAIS', subtitle: '2022-2023' },
    { category: ActivityCategory.EPREUVE, title: '2018', subjectLabel: 'MATHS', subtitle: '2018' },
    { category: ActivityCategory.EPREUVE, title: '2021', subjectLabel: 'PHILOSOPHIE', subtitle: '2021' },
    { category: ActivityCategory.EPREUVE, title: '2020', subjectLabel: 'PHYSIQUE', subtitle: '2020' },
    { category: ActivityCategory.EXERCICE, title: 'EXERCICE 1', subjectLabel: 'MATHS', progressPct: 60 },
    { category: ActivityCategory.EXERCICE, title: 'EXERCICE 2', subjectLabel: 'MATHS', progressPct: 20 },
  ];
  await prisma.activity.deleteMany({});
  await prisma.activity.createMany({ data: activities.map((a, order) => ({ ...a, order })) });
  console.log(`✓ ${activities.length} activités/épreuves`);
}

async function seedBadges() {
  const badges = [
    { code: 'first_quiz', label: '1er quiz', icon: '⭐', order: 0 },
    { code: 'streak_5', label: '5 jours', icon: '🔥', order: 1 },
    { code: 'philosopher', label: 'Philosophe', icon: '🦉', order: 2 },
    { code: 'first_lesson', label: '1re leçon', icon: '📘', order: 3 },
  ];
  for (const b of badges) {
    await prisma.badge.upsert({ where: { code: b.code }, update: b, create: b });
  }
  console.log(`✓ ${badges.length} badges`);
}

async function seedDemoUser() {
  const passwordHash = await bcrypt.hash('lasylab', 10);
  const user = await prisma.user.upsert({
    where: { phone: '691111111' },
    update: {},
    create: {
      role: UserRole.STUDENT,
      name: 'Sara',
      phone: '691111111',
      passwordHash,
      classe: '1ère',
      objectifs: ['Augmenter mes notes'],
      birthYear: 2008,
      school: 'Lycée Lasylab',
      consent: true,
      streak: 5,
      gems: 12,
      xp: 340,
    },
  });

  // Progression initiale (comme l'état par défaut du mock)
  const initial: Record<string, number> = { francais: 4, philosophie: 2 };
  for (const [subjectId, completedNodes] of Object.entries(initial)) {
    await prisma.progress.upsert({
      where: { userId_subjectId: { userId: user.id, subjectId } },
      update: { completedNodes },
      create: { userId: user.id, subjectId, completedNodes },
    });
  }

  // Badges obtenus par l'élève de démo
  for (const code of ['first_quiz', 'streak_5', 'philosopher']) {
    const badge = await prisma.badge.findUnique({ where: { code } });
    if (badge) {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId: user.id, badgeId: badge.id } },
        update: {},
        create: { userId: user.id, badgeId: badge.id },
      });
    }
  }
  console.log('✓ Élève de démo : Sara (691111111 / lasylab)');
}

async function seedDemoTeacher() {
  const passwordHash = await bcrypt.hash('lasylab', 10);
  await prisma.user.upsert({
    where: { phone: '692222222' },
    update: {},
    create: {
      role: UserRole.TEACHER,
      name: 'M. Koffi',
      phone: '692222222',
      passwordHash,
      subjects: ['maths', 'informatique'],
      schools: ['Lycée Lasylab'],
      classes: ['1ère', 'Tle'],
      objectifs: ['Créer des contenus pédagogiques', "Apprendre à utiliser l'IA"],
      consent: true,
    },
  });
  console.log('✓ Enseignant de démo : M. Koffi (692222222 / lasylab)');
}

async function seedDemoParent() {
  const passwordHash = await bcrypt.hash('lasylab', 10);
  const parent = await prisma.user.upsert({
    where: { phone: '693333333' },
    update: {},
    create: {
      role: UserRole.PARENT,
      name: 'Mme Adjovi',
      phone: '693333333',
      passwordHash,
      childrenCount: 2,
      consent: true,
    },
  });

  // Deux comptes enfants rattachés (prénoms), s'ils n'existent pas déjà.
  const existing = await prisma.user.count({ where: { parentId: parent.id } });
  if (existing === 0) {
    for (const [name, classe] of [
      ['Tatiane', '3e'],
      ['Hugues', '1ère'],
    ] as const) {
      await prisma.user.create({
        data: { role: UserRole.STUDENT, name, classe, parentId: parent.id },
      });
    }
  }
  console.log('✓ Parent de démo : Mme Adjovi (693333333 / lasylab) + 2 enfants');
}

async function main() {
  console.log('🌱 Seed Lasylab…');
  await seedSubjects();
  await seedMaths();
  await seedPhilosophie();
  await seedStories();
  await seedActivities();
  await seedBadges();
  await seedDemoUser();
  await seedDemoTeacher();
  await seedDemoParent();
  console.log('✅ Seed terminé.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
