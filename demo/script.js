(function() {

	let {
		computed,
		customRef,
		shallowRef,
		watch,
	} = VueCompositionAPI;

	let getHeroImageURL = (key => `https://i.annihil.us/u/prod/marvel/i/mg/${key}/standard_xlarge.jpg`);
	let heroes = [
		{
			name: 'Black Widow',
			image: getHeroImageURL('f/30/50fecad1f395b'),
		},
		{
			name: 'Captain America',
			image: getHeroImageURL('3/50/537ba56d31087'),
		},
		{
			name: 'Deadpool',
			image: getHeroImageURL('9/90/5261a86cacb99'),
		},
		{
			name: 'Doctor Strange',
			image: getHeroImageURL('5/f0/5261a85a501fe'),
		},
		{
			name: 'Hulk',
			image: getHeroImageURL('5/a0/538615ca33ab0'),
		},
		{
			name: 'Iron Man',
			image: getHeroImageURL('6/a0/55b6a25e654e6'),
		},
		{
			name: 'Scarlet Witch',
			image: getHeroImageURL('6/70/5261a7d7c394b'),
		},
		{
			name: 'Spider-Man',
			image: getHeroImageURL('9/30/538cd33e15ab7'),
		},
		{
			name: 'Thor',
			image: getHeroImageURL('5/a0/537bc7036ab02'),
		},
	];

	new Vue({
		el: '#App',
		vuetify: new Vuetify(),
		setup() {
			let createStep = (instance => {
				let candidates = instance.getCandidates();
				return {
					instance,
					candidates,
					first: null,
					last: null,
				};
			});
			let createSteps = (() => {
				let instance = MaxDiff(_.shuffle(heroes));
				return [createStep(instance)];
			});
			let stepsRef = shallowRef(createSteps());
			let restart = (() => {
				stepsRef.value = createSteps();
			});
			let currStepIndexRef = computed(() => {
				let steps = stepsRef.value;
				return steps.length - 1;
			});
			let currStepRef = computed(() => {
				let array = stepsRef.value;
				let index = currStepIndexRef.value;
				return array[index];
			});
			let currMaxDiffInstanceRef = computed(() => currStepRef.value.instance);
			let heroesRef = computed(() => currStepRef.value.candidates);
			let coolHeroRef = customRef((track, trigger) => {
				return {
					get() {
						track();
						return currStepRef.value.first;
					},
					set(value) {
						let step = currStepRef.value;
						if (step.first !== value) {
							step.first = value;
							trigger();
						}
					},
				};
			});
			let lameHeroRef = customRef((track, trigger) => {
				return {
					get() {
						track();
						return currStepRef.value.last;
					},
					set(value) {
						let step = currStepRef.value;
						if (step.last !== value) {
							step.last = value;
							trigger();
						}
					},
				};
			});
			watch(coolHeroRef, coolHero => {
				if (coolHero) {
					let heroes = heroesRef.value;
					if (heroes.length === 2) {
						lameHeroRef.value = _.without(heroes, coolHero)[0];
					}
				}
			});
			watch(lameHeroRef, lameHero => {
				if (lameHero) {
					let heroes = heroesRef.value;
					if (heroes.length === 2) {
						coolHeroRef.value = _.without(heroes, lameHero)[0];
					}
				}
			});
			let goToPrevStepRef = computed(() => {
				let steps = stepsRef.value;
				if (steps.length > 1) {
					return (() => {
						steps.pop();
						stepsRef.value = steps;
					});
				}
			});
			let goToNextStepRef = computed(() => {
				let coolHero = coolHeroRef.value;
				let lameHero = lameHeroRef.value;
				if (coolHero && lameHero && coolHero !== lameHero) {
					return (() => {
						let instance = currMaxDiffInstanceRef.value;
						instance = instance.clone();
						instance.order(coolHero, lameHero);
						let heroes = heroesRef.value;
						heroes.forEach(hero => {
							if (hero !== coolHero && hero !== lameHero) {
								instance.order(coolHero, hero, lameHero);
							}
						});
						let steps = stepsRef.value;
						steps.push(createStep(instance));
						stepsRef.value = steps;
					});
				}
			});
			let goesForwardRef = shallowRef(true);
			watch(currStepIndexRef, (currStepIndex, prevStepIndex) => {
				goesForwardRef.value = currStepIndex > prevStepIndex;
			});
			return {
				currStepIndex: currStepIndexRef,
				goesForward: goesForwardRef,
				complete: computed(() => currMaxDiffInstanceRef.value.complete),
				progress: computed(() => currMaxDiffInstanceRef.value.progress),
				result: computed(() => currMaxDiffInstanceRef.value.result),
				intermediateResult: computed(() => currMaxDiffInstanceRef.value.getOrderedGroups()),
				showIntermediateResult: shallowRef(false),
				heroes: heroesRef,
				coolHero: coolHeroRef,
				lameHero: lameHeroRef,
				goToNextStep: goToNextStepRef,
				goToPrevStep: goToPrevStepRef,
				restart,
			};
		},
	});

})();
