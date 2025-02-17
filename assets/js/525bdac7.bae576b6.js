"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[8628],{21041:(e,i,t)=>{t.r(i),t.d(i,{assets:()=>d,contentTitle:()=>o,default:()=>c,frontMatter:()=>s,metadata:()=>r,toc:()=>l});var a=t(85893),n=t(11151);const s={sidebar_position:18,title:"ICS with Inactive Provider Validators"},o="ADR 017: ICS with Inactive Provider Validators",r={id:"adrs/adr-017-allowing-inactive-validators",title:"ICS with Inactive Provider Validators",description:"Changelog",source:"@site/versioned_docs/version-v5.2.0/adrs/adr-017-allowing-inactive-validators.md",sourceDirName:"adrs",slug:"/adrs/adr-017-allowing-inactive-validators",permalink:"/interchain-security/v5.2.0/adrs/adr-017-allowing-inactive-validators",draft:!1,unlisted:!1,tags:[],version:"v5.2.0",sidebarPosition:18,frontMatter:{sidebar_position:18,title:"ICS with Inactive Provider Validators"},sidebar:"tutorialSidebar",previous:{title:"Security aggregation",permalink:"/interchain-security/v5.2.0/adrs/adr-016-securityaggregation"},next:{title:"Remove VSCMatured Packets",permalink:"/interchain-security/v5.2.0/adrs/adr-018-remove-vscmatured"}},d={},l=[{value:"Changelog",id:"changelog",level:2},{value:"Status",id:"status",level:2},{value:"Context",id:"context",level:2},{value:"Decision",id:"decision",level:2},{value:"Changes to the state",id:"changes-to-the-state",level:3},{value:"Risk Mitigations",id:"risk-mitigations",level:2},{value:"Testing Scenarios",id:"testing-scenarios",level:2},{value:"Scenario 1: Inactive validators should not be considered by governance",id:"scenario-1-inactive-validators-should-not-be-considered-by-governance",level:3},{value:"Scenario 2: Inactive validators should not get rewards from the provider chain",id:"scenario-2-inactive-validators-should-not-get-rewards-from-the-provider-chain",level:3},{value:"Scenario 3: Inactive validators should get rewards from consumer chains",id:"scenario-3-inactive-validators-should-get-rewards-from-consumer-chains",level:3},{value:"Scenario 4: Inactive validators should not get slashed/jailed for downtime on the provider chain",id:"scenario-4-inactive-validators-should-not-get-slashedjailed-for-downtime-on-the-provider-chain",level:3},{value:"Scenario 5: Inactive validators <em>should</em> get jailed for consumer downtime on the provider chain",id:"scenario-5-inactive-validators-should-get-jailed-for-consumer-downtime-on-the-provider-chain",level:3},{value:"Scenario 6: Inactive validators should not be counted when computing the minimum power in the top N",id:"scenario-6-inactive-validators-should-not-be-counted-when-computing-the-minimum-power-in-the-top-n",level:3},{value:"Scenario 7: Mint does not consider inactive validators",id:"scenario-7-mint-does-not-consider-inactive-validators",level:3},{value:"Scenarios 8: Inactive validators can validate on consumer chains",id:"scenarios-8-inactive-validators-can-validate-on-consumer-chains",level:3},{value:"Scenario 9: MinStake parameters is respected",id:"scenario-9-minstake-parameters-is-respected",level:3},{value:"Consequences",id:"consequences",level:2},{value:"Positive",id:"positive",level:3},{value:"Negative",id:"negative",level:3},{value:"Sybil attacks",id:"sybil-attacks",level:4},{value:"Reputational damage is not a deterrent",id:"reputational-damage-is-not-a-deterrent",level:4},{value:"Additional negative consequences",id:"additional-negative-consequences",level:4},{value:"Neutral",id:"neutral",level:3},{value:"Alternative considerations",id:"alternative-considerations",level:2},{value:"Modifying the staking module",id:"modifying-the-staking-module",level:3},{value:"Allowing unbonding validators to validate",id:"allowing-unbonding-validators-to-validate",level:3},{value:"References",id:"references",level:2}];function h(e){const i={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",p:"p",ul:"ul",...(0,n.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(i.h1,{id:"adr-017-ics-with-inactive-provider-validators",children:"ADR 017: ICS with Inactive Provider Validators"}),"\n",(0,a.jsx)(i.h2,{id:"changelog",children:"Changelog"}),"\n",(0,a.jsxs)(i.ul,{children:["\n",(0,a.jsx)(i.li,{children:"15th May 2024: Initial draft"}),"\n"]}),"\n",(0,a.jsx)(i.h2,{id:"status",children:"Status"}),"\n",(0,a.jsx)(i.p,{children:"Accepted"}),"\n",(0,a.jsx)(i.h2,{id:"context",children:"Context"}),"\n",(0,a.jsx)(i.p,{children:"Currently, only validators in the active set on the provider can validate on consumer chains, which limits the number of validators that can participate in Interchain Security (ICS).\nValidators outside of the active set might be willing\nto validate on consumer chains, but we might not want to make the provider validator set larger, e.g. to not put more strain on the consensus engine.\nThis runs the risk of leaving consumer chains with too few validators."}),"\n",(0,a.jsxs)(i.p,{children:["The purpose of this ADR is to allow validators that are ",(0,a.jsx)(i.em,{children:"not"})," part of the consensus process on the provider chain (because they are inactive)\nto validate on consumer chains."]}),"\n",(0,a.jsx)(i.p,{children:'In the context of this ADR, "consensus validator set" is the set of validators participating in the consensus protocol, and "staking validator set" is the set of validators viewed as active by the staking module.'}),"\n",(0,a.jsx)(i.p,{children:"Currently, the staking module, provider module, and CometBFT interact in this way:"}),"\n",(0,a.jsx)(i.p,{children:(0,a.jsx)(i.img,{alt:"inactivevals_before.png",src:t(74809).Z+"",width:"874",height:"723"})}),"\n",(0,a.jsxs)(i.p,{children:["The staking module keeps a list of validators. The ",(0,a.jsx)(i.code,{children:"MaxValidators"}),' validators with the largest amount of stake are "active" validators. ',(0,a.jsx)(i.code,{children:"MaxValidators"})," is a parameter of the staking module. The staking module sends these validators to CometBFT to inform which validators make up the next consensus validators, that is, the set of validators participating in the consensus process. Separately, the provider module reads the list of bonded validators and sends this to the consumer chain, after shaping it according to which validators are opted in and the parameters set by the consumer chain for allowlist, denylist, etc."]}),"\n",(0,a.jsx)(i.h2,{id:"decision",children:"Decision"}),"\n",(0,a.jsx)(i.p,{children:"The proposed solution to allow validators that are not participating in the consensus process on the provider (inactive validators) is to change 3 main things:"}),"\n",(0,a.jsxs)(i.p,{children:["a) increase the ",(0,a.jsx)(i.code,{children:"MaxValidators"})," parameter of the staking module"]}),"\n",(0,a.jsxs)(i.p,{children:["b) do ",(0,a.jsx)(i.em,{children:"not"})," take the updates for CometBFT directly from the bonded validators in the staking module, by wrapping the staking modules ",(0,a.jsx)(i.code,{children:"EndBlocker"})," with a dummy EndBlocker that doesn't return any validator updates. Instead, we adjust the provider module to return validator updates on its EndBlocker. These validator updates are obtained by ",(0,a.jsx)(i.em,{children:"filtering"})," the bonded validators to send only the first ",(0,a.jsx)(i.code,{children:"MaxProviderConsensusValidators"})," (sorted by largest amount of stake first) many validators to CometBFT"]}),"\n",(0,a.jsx)(i.p,{children:"c) use the enlarged list of bonded validators from the staking module as basis for the validator set that the provider module sends to consumer chains (again after applying power shaping and filtering out validators that are not opted in)."}),"\n",(0,a.jsx)(i.p,{children:"In consequence, the provider chain can keep a reasonably-sized consensus validator set, while giving consumer chains a much larger pool of potential validators."}),"\n",(0,a.jsx)(i.p,{children:(0,a.jsx)(i.img,{alt:"inactivevals_after.png",src:t(95764).Z+"",width:"874",height:"723"})}),"\n",(0,a.jsx)(i.p,{children:"Some additional considerations:"}),"\n",(0,a.jsxs)(i.ul,{children:["\n",(0,a.jsx)(i.li,{children:"Migration: In the migration, the last consensus validator set will be set to the last active validator set from the view of the staking module. Existing consumer chains are migrated to have a validator set size cap (otherwise, they could end up with a huge validator set including all the staking-but-not-consensus-active validators from the provider chain)"}),"\n",(0,a.jsxs)(i.li,{children:["Slashing: Validators that are not part of the active set on the provider chain can still be jailed for downtime on a consumer chain (via an Interchain Security SlashPacket sent to the provider, who will then jail the validator), but they ",(0,a.jsx)(i.em,{children:"are not"})," slashed for downtime on the provider chain.\nThis is achieved without any additional changes to the slashing module, because the slashing module checks for downtime by looking at the consensus participants reported by CometBFT, and thus with the proposed solution, validators that are not part of the consensus validators on the provider chain are not considered for downtime slashing (see ",(0,a.jsx)(i.a,{href:"https://github.com/cosmos/cosmos-sdk/blob/v0.47.11/x/slashing/abci.go#L22",children:"https://github.com/cosmos/cosmos-sdk/blob/v0.47.11/x/slashing/abci.go#L22"}),")."]}),"\n",(0,a.jsxs)(i.li,{children:["Rewards: Validators that are not part of the active set on the provider chain can still receive rewards on the consumer chain, but they ",(0,a.jsx)(i.em,{children:"do not"})," receive rewards from the provider chain. This change is\nachieved without further changes to staking or reward distributions, because similar to downtime, rewards are based on the consensus validator set (see ",(0,a.jsx)(i.a,{href:"https://github.com/cosmos/cosmos-sdk/blob/v0.47.11/x/distribution/abci.go#L28",children:"https://github.com/cosmos/cosmos-sdk/blob/v0.47.11/x/distribution/abci.go#L28"}),")"]}),"\n"]}),"\n",(0,a.jsx)(i.h3,{id:"changes-to-the-state",children:"Changes to the state"}),"\n",(0,a.jsx)(i.p,{children:"The following changes to the state are required:"}),"\n",(0,a.jsxs)(i.ul,{children:["\n",(0,a.jsxs)(i.li,{children:["Introduce the ",(0,a.jsx)(i.code,{children:"MaxProviderConsensusValidators"})," parameter to the provider module, which is the number of validators that the provider module will send to the consensus engine."]}),"\n",(0,a.jsxs)(i.li,{children:["Store the provider consensus validator set in the provider module state under the ",(0,a.jsx)(i.code,{children:"LastProviderConsensusValsPrefix"})," key. This is the last set of validators that the provider sent to the consensus engine. This is needed to compute the ValUpdates to send to the consensus engine (by diffing the current set with this last sent set)."]}),"\n",(0,a.jsxs)(i.li,{children:["Increase the ",(0,a.jsx)(i.code,{children:"MaxValidators"})," parameter of the staking module to the desired size of the potential validator\nset of consumer chains."]}),"\n",(0,a.jsxs)(i.li,{children:["Introduce extra per-consumer-chain parameters:","\n",(0,a.jsxs)(i.ul,{children:["\n",(0,a.jsxs)(i.li,{children:[(0,a.jsx)(i.code,{children:"MinStake"}),": is the minimum amount of stake a validator must have to be considered for validation on the consumer chain."]}),"\n",(0,a.jsxs)(i.li,{children:[(0,a.jsx)(i.code,{children:"AllowInactiveVals"}),": is a boolean that determines whether validators that are not part of the active set on the provider chain can validate on the consumer chain. If this is set to ",(0,a.jsx)(i.code,{children:"true"}),", validators outside the active set on the provider chain can validate on the consumer chain. If this is set to ",(0,a.jsx)(i.code,{children:"true"}),", validators outside the active set on the provider chain cannot validate on the consumer chain."]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(i.h2,{id:"risk-mitigations",children:"Risk Mitigations"}),"\n",(0,a.jsx)(i.p,{children:"To mitigate risks from validators with little stake, we introduce a minimum stake requirement for validators to be able to validate on consumer chains, which can be set by each consumer chain independently, with a default value set by the provider chain."}),"\n",(0,a.jsx)(i.p,{children:"Additional risk mitigations are to increase the active set size slowly, and to monitor the effects on the network closely. For the first iteration, we propose to increase the active set size to 200 validators (while keeping the consensus validators to 180), thus letting the 20 validators with the most stake outside of the active set validate on consumer chains."}),"\n",(0,a.jsx)(i.h2,{id:"testing-scenarios",children:"Testing Scenarios"}),"\n",(0,a.jsx)(i.p,{children:"In the following,"}),"\n",(0,a.jsxs)(i.ul,{children:["\n",(0,a.jsx)(i.li,{children:"bonded validators refers to all validators that have bonded stake,"}),"\n",(0,a.jsx)(i.li,{children:"active validators refers to the validators that take part in consensus,"}),"\n",(0,a.jsx)(i.li,{children:"inactive validators refers to bonded validators that are not active validators."}),"\n"]}),"\n",(0,a.jsx)(i.h3,{id:"scenario-1-inactive-validators-should-not-be-considered-by-governance",children:"Scenario 1: Inactive validators should not be considered by governance"}),"\n",(0,a.jsx)(i.p,{children:"Inactive validators should not be considered for the purpose of governance.\nIn particular, the quorum should depend only on active validators."}),"\n",(0,a.jsx)(i.p,{children:"We test this by:"}),"\n",(0,a.jsxs)(i.ul,{children:["\n",(0,a.jsx)(i.li,{children:"creating a provider chain (either with 3 active validators, or with only 1 active validator), a quorum of 50%, and 3 validators with alice=300, bob=299, charlie=299 stake"}),"\n",(0,a.jsx)(i.li,{children:"we create a governance proposal"}),"\n",(0,a.jsx)(i.li,{children:"alice votes for the proposal"}),"\n",(0,a.jsxs)(i.li,{children:["we check that the proposal has the right status:","\n",(0,a.jsxs)(i.ul,{children:["\n",(0,a.jsxs)(i.li,{children:["in the scenario where\xa0we have 3 active validators, the proposal ",(0,a.jsx)(i.em,{children:"should not"})," have passed, because alice alone is not enough to fulfill the quorum"]}),"\n",(0,a.jsxs)(i.li,{children:["in the scenario where we have 1 active validator, the proposal ",(0,a.jsx)(i.em,{children:"should"})," have passed, because alice is the only active validator, and thus fulfills the quorum"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,a.jsxs)(i.p,{children:["Tested by the e2e tests ",(0,a.jsx)(i.code,{children:"inactive-provider-validators-governance"})," (scenario with 1 active val) and ",(0,a.jsx)(i.code,{children:"inactive-provider-validators-governance-basecase"})," (scenario with 3 active vals)."]}),"\n",(0,a.jsx)(i.h3,{id:"scenario-2-inactive-validators-should-not-get-rewards-from-the-provider-chain",children:"Scenario 2: Inactive validators should not get rewards from the provider chain"}),"\n",(0,a.jsx)(i.p,{children:"Inactive validators should not get rewards from the provider chain."}),"\n",(0,a.jsx)(i.p,{children:"This can be tested by starting a provider chain with inactive validators and checking the rewards of inactive validators."}),"\n",(0,a.jsxs)(i.p,{children:["Checked as part of the e2e test ",(0,a.jsx)(i.code,{children:"inactive-provider-validators-on-consumer"}),"."]}),"\n",(0,a.jsx)(i.h3,{id:"scenario-3-inactive-validators-should-get-rewards-from-consumer-chains",children:"Scenario 3: Inactive validators should get rewards from consumer chains"}),"\n",(0,a.jsx)(i.p,{children:"An inactive validator that is validating on a consumer chain should receive rewards in the consumer chain token."}),"\n",(0,a.jsxs)(i.p,{children:["Checked as part of the e2e test ",(0,a.jsx)(i.code,{children:"inactive-provider-validators-on-consumer"}),"."]}),"\n",(0,a.jsx)(i.h3,{id:"scenario-4-inactive-validators-should-not-get-slashedjailed-for-downtime-on-the-provider-chain",children:"Scenario 4: Inactive validators should not get slashed/jailed for downtime on the provider chain"}),"\n",(0,a.jsx)(i.p,{children:"This can be tested by having an inactive validator go offline on the provider chain for long enough to accrue downtime.\nThe validator should be neither slashed nor jailed for downtime."}),"\n",(0,a.jsxs)(i.p,{children:["Checked as part of the e2e test ",(0,a.jsx)(i.code,{children:"inactive-provider-validators-on-consumer"}),"."]}),"\n",(0,a.jsxs)(i.h3,{id:"scenario-5-inactive-validators-should-get-jailed-for-consumer-downtime-on-the-provider-chain",children:["Scenario 5: Inactive validators ",(0,a.jsx)(i.em,{children:"should"})," get jailed for consumer downtime on the provider chain"]}),"\n",(0,a.jsx)(i.p,{children:"This can be tested by having an inactive validator go offline on a consumer chain for long enough to accrue downtime.\nThe consumer chain should send a SlashPacket to the provider chain, which should jail the validator."}),"\n",(0,a.jsxs)(i.p,{children:["Checked as part of the e2e test ",(0,a.jsx)(i.code,{children:"inactive-provider-validators-on-consumer"}),"."]}),"\n",(0,a.jsx)(i.h3,{id:"scenario-6-inactive-validators-should-not-be-counted-when-computing-the-minimum-power-in-the-top-n",children:"Scenario 6: Inactive validators should not be counted when computing the minimum power in the top N"}),"\n",(0,a.jsx)(i.p,{children:"This can be tested like this:"}),"\n",(0,a.jsxs)(i.ul,{children:["\n",(0,a.jsxs)(i.li,{children:["Start a provider chain with validator powers alice=300, bob=200, charlie=100 and 2 max provider consensus validators","\n",(0,a.jsxs)(i.ul,{children:["\n",(0,a.jsx)(i.li,{children:"So alice and bob will validate on the provider"}),"\n"]}),"\n"]}),"\n",(0,a.jsxs)(i.li,{children:["Start a consumer chain with top N = 51%.","\n",(0,a.jsxs)(i.ul,{children:["\n",(0,a.jsxs)(i.li,{children:["Without inactive validators, this means both alice and bob have to validate. But since charlie is inactive, this means bob is ",(0,a.jsx)(i.em,{children:"not"})," in the top N"]}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(i.li,{children:"Verify that alice is in the top N, but bob is not"}),"\n"]}),"\n",(0,a.jsxs)(i.p,{children:["Checked as part of the e2e test ",(0,a.jsx)(i.code,{children:"inactive-vals-topN"}),"."]}),"\n",(0,a.jsx)(i.h3,{id:"scenario-7-mint-does-not-consider-inactive-validators",children:"Scenario 7: Mint does not consider inactive validators"}),"\n",(0,a.jsx)(i.p,{children:"To compute the inflation rate, only the active validators should be considered."}),"\n",(0,a.jsx)(i.p,{children:"We can check this by querying the inflation rate change over subsequent blocks."}),"\n",(0,a.jsx)(i.p,{children:"We start a provider chain with these arguments"}),"\n",(0,a.jsxs)(i.ul,{children:["\n",(0,a.jsx)(i.li,{children:"3 validators with powers alice=290, bob=280, charlie=270"}),"\n",(0,a.jsx)(i.li,{children:"either 1 or 3 active validators"}),"\n",(0,a.jsx)(i.li,{children:"a bonded goal of 300 tokens (this is given in percent, but we simplify here)"}),"\n"]}),"\n",(0,a.jsxs)(i.p,{children:["If we have 3 validators active, then the inflation rate should ",(0,a.jsx)(i.em,{children:"decrease"})," between blocks, because the bonded goal is exceeded as all validators are bonded.\nIf we have only 1 validator active, then the inflation rate should ",(0,a.jsx)(i.em,{children:"increase"})," between blocks, because the bonded goal is not met."]}),"\n",(0,a.jsxs)(i.p,{children:["Checked as part of the e2e tests ",(0,a.jsx)(i.code,{children:"inactive-vals-mint"})," (scenario with 1 active val) and ",(0,a.jsx)(i.code,{children:"mint-basecase"})," (scenario with 3 active vals)."]}),"\n",(0,a.jsx)(i.h3,{id:"scenarios-8-inactive-validators-can-validate-on-consumer-chains",children:"Scenarios 8: Inactive validators can validate on consumer chains"}),"\n",(0,a.jsx)(i.p,{children:"An inactive validator can opt in and validate on consumer chains (if min stake allows it)"}),"\n",(0,a.jsxs)(i.p,{children:["Checked as part of the e2e test ",(0,a.jsx)(i.code,{children:"inactive-provider-validators-on-consumer"}),"."]}),"\n",(0,a.jsx)(i.h3,{id:"scenario-9-minstake-parameters-is-respected",children:"Scenario 9: MinStake parameters is respected"}),"\n",(0,a.jsx)(i.p,{children:"Validators that don't meet the criteria for a consumer chain cannot validate on it."}),"\n",(0,a.jsxs)(i.p,{children:["Checked in the e2e tests ",(0,a.jsx)(i.code,{children:"min-stake"}),"."]}),"\n",(0,a.jsx)(i.h2,{id:"consequences",children:"Consequences"}),"\n",(0,a.jsx)(i.h3,{id:"positive",children:"Positive"}),"\n",(0,a.jsxs)(i.ul,{children:["\n",(0,a.jsx)(i.li,{children:"Validators outside of the active set can validate on consumer chains without having an impact on the consensus engine of the provider chain"}),"\n",(0,a.jsx)(i.li,{children:"Consumer chains can have a much larger validator set than the provider chain if they prefer this e.g. for decentralization reasons"}),"\n",(0,a.jsx)(i.li,{children:"Consumer chain teams can, with much less cost than today, start up their own consumer chain node to keep the chain running (in a centralized manner) even if no hub validators have opted in to validate on the chain. This is useful to stop the chain from ending up with an empty validator set and becoming recoverable only with a hardfork"}),"\n"]}),"\n",(0,a.jsx)(i.h3,{id:"negative",children:"Negative"}),"\n",(0,a.jsx)(i.p,{children:"Allowing validators from the inactive set brings with it some additional risks.\nIn general, consumer chains will now face some of the problems also faced by standalone chains. It\u2019s reasonable to assume that the validator set on the hub has a minimum amount of operational quality due to being battle tested and decentralized, and consumer chains with validators from outside the hub active set cannot rely on this as much anymore."}),"\n",(0,a.jsx)(i.h4,{id:"sybil-attacks",children:"Sybil attacks"}),"\n",(0,a.jsx)(i.p,{children:"With the restricted size of the active set today, it\u2019s clear that the set is at least minimally competitive and it is not trivial to spin up multiple nodes as a validator."}),"\n",(0,a.jsx)(i.p,{children:"When we make the \u201cpotential validator set\u201d much larger, we should assume that it becomes much less competitive to be part of that set, and thus trivial for single entities to control many of those validators."}),"\n",(0,a.jsx)(i.h4,{id:"reputational-damage-is-not-a-deterrent",children:"Reputational damage is not a deterrent"}),"\n",(0,a.jsx)(i.p,{children:"For validators in the active set, we typically assume that if they would misbehave, they pay a large reputational cost. This represents delegators deciding to switch validators (potentially even on chains other than the one the misbehaviour happened on), and loss of credibility in the ecosystem. With the much larger active set, it seems prudent to assume that reputational damage is not a deterrent for many validators. They might only have minimal amounts of delegated stake and control most of it themselves, so they might not be deterred from performing actions that would usually bring reputational damage."}),"\n",(0,a.jsx)(i.h4,{id:"additional-negative-consequences",children:"Additional negative consequences"}),"\n",(0,a.jsxs)(i.ul,{children:["\n",(0,a.jsx)(i.li,{children:"The provider keeper will need to implement the staking keeper interface, and modules need to be wired up to either the staking or provider keeper, depending on whether they need the consensus or staking validator set"}),"\n",(0,a.jsx)(i.li,{children:"This will impact how future modules are integrated, since we will need to consider whether those modules should consider the consensus validators or the bonded validators (which other modules might assume to be the same)"}),"\n"]}),"\n",(0,a.jsx)(i.h3,{id:"neutral",children:"Neutral"}),"\n",(0,a.jsxs)(i.ul,{children:["\n",(0,a.jsx)(i.li,{children:"There might be validators that are bonded, but not validating on any chain at all. This is not a problem, but it might be a bit confusing."}),"\n"]}),"\n",(0,a.jsx)(i.h2,{id:"alternative-considerations",children:"Alternative considerations"}),"\n",(0,a.jsx)(i.h3,{id:"modifying-the-staking-module",children:"Modifying the staking module"}),"\n",(0,a.jsxs)(i.p,{children:["We could instead adapt the ",(0,a.jsx)(i.em,{children:"staking module"})," with a similar change.\nThis might be better if it turns out that the staking module active set is used in many other places."]}),"\n",(0,a.jsx)(i.h3,{id:"allowing-unbonding-validators-to-validate",children:"Allowing unbonding validators to validate"}),"\n",(0,a.jsx)(i.p,{children:"Instead of increasing the active set size, we could allow validators that are unbonded (but still exist on the provider) to validate consumer chains.\nFor this, we would need to:"}),"\n",(0,a.jsxs)(i.ul,{children:["\n",(0,a.jsx)(i.li,{children:"Modify the VSC updates to consider the set of all validators, even unbonded ones, instead of just active ones"}),"\n",(0,a.jsx)(i.li,{children:"Adjust our downtime jailing/equivocation slashing logic to work correctly with unbonded validators. This is very hard, because redelegations are not usually tracked for unbonded validators."}),"\n"]}),"\n",(0,a.jsx)(i.h2,{id:"references",children:"References"}),"\n",(0,a.jsxs)(i.ul,{children:["\n",(0,a.jsxs)(i.li,{children:[(0,a.jsx)(i.a,{href:"/interchain-security/v5.2.0/adrs/adr-016-securityaggregation",children:"Security Aggregation"})," has similar concerns where the staking validator set will differ from the consensus validator set"]}),"\n"]})]})}function c(e={}){const{wrapper:i}={...(0,n.a)(),...e.components};return i?(0,a.jsx)(i,{...e,children:(0,a.jsx)(h,{...e})}):h(e)}},95764:(e,i,t)=>{t.d(i,{Z:()=>a});const a=t.p+"assets/images/inactivevals_after-ac23b4c6474ed6bb2105369cdf8482a0.png"},74809:(e,i,t)=>{t.d(i,{Z:()=>a});const a=t.p+"assets/images/inactivevals_before-a963b865d2029f6629845f7b1beb215b.png"},11151:(e,i,t)=>{t.d(i,{Z:()=>r,a:()=>o});var a=t(67294);const n={},s=a.createContext(n);function o(e){const i=a.useContext(s);return a.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function r(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:o(e.components),a.createElement(s.Provider,{value:i},e.children)}}}]);