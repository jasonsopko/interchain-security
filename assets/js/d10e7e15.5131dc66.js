"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[8876],{97414:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>a,contentTitle:()=>t,default:()=>h,frontMatter:()=>r,metadata:()=>d,toc:()=>l});var s=i(85893),o=i(11151);const r={sidebar_position:2,title:"Denom DOS fixes"},t="ADR 004: Denom DOS fixes",d={id:"adrs/adr-004-denom-dos-fixes",title:"Denom DOS fixes",description:"Changelog",source:"@site/versioned_docs/version-v6.1.0/adrs/adr-004-denom-dos-fixes.md",sourceDirName:"adrs",slug:"/adrs/adr-004-denom-dos-fixes",permalink:"/interchain-security/v6.1.0/adrs/adr-004-denom-dos-fixes",draft:!1,unlisted:!1,tags:[],version:"v6.1.0",sidebarPosition:2,frontMatter:{sidebar_position:2,title:"Denom DOS fixes"},sidebar:"tutorialSidebar",previous:{title:"Overview",permalink:"/interchain-security/v6.1.0/adrs/intro"},next:{title:"Pause validator unbonding during equivocation proposal",permalink:"/interchain-security/v6.1.0/adrs/adr-007-pause-unbonding-on-eqv-prop"}},a={},l=[{value:"Changelog",id:"changelog",level:2},{value:"Status",id:"status",level:2},{value:"Context",id:"context",level:2},{value:"Decision",id:"decision",level:2},{value:"Provider",id:"provider",level:3},{value:"Consumer",id:"consumer",level:3},{value:"Consequences",id:"consequences",level:2},{value:"Positive",id:"positive",level:3},{value:"Negative",id:"negative",level:3}];function c(e){const n={h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",ul:"ul",...(0,o.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"adr-004-denom-dos-fixes",children:"ADR 004: Denom DOS fixes"}),"\n",(0,s.jsx)(n.h2,{id:"changelog",children:"Changelog"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"5/9/2023: ADR created"}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"status",children:"Status"}),"\n",(0,s.jsx)(n.p,{children:"Accepted"}),"\n",(0,s.jsx)(n.h2,{id:"context",children:"Context"}),"\n",(0,s.jsx)(n.p,{children:"The provider and consumer modules are vulnerable to similar issues involving an attacker sending millions of denoms to certain addresses and causing the chain to halt. This ADR outlines both fixes since they are similar. Both fixes involve processing only denoms that are on a whitelist to avoid iterating over millions of junk denoms but have different requirements and are implemented in different ways."}),"\n",(0,s.jsx)(n.h2,{id:"decision",children:"Decision"}),"\n",(0,s.jsx)(n.h3,{id:"provider",children:"Provider"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Put the distribution module's FeePoolAddress back on the blocklist so that it cannot receive funds from users."}),"\n",(0,s.jsx)(n.li,{children:"Create a new address called ConsumerRewardPool and unblock it, allowing funds to be sent to it."}),"\n",(0,s.jsx)(n.li,{children:"Create a set of strings in the store for allowed ConsumerRewardDenoms."}),"\n",(0,s.jsx)(n.li,{children:"Create an endpoint called RegisterConsumerRewardDenom which deducts a fee from the sender's account, sends it to the community pool and adds a string to the ConsumerRewardDenoms set."}),"\n",(0,s.jsx)(n.li,{children:"Create a parameter called ConsumerRewardDenomRegistrationFee which determines the fee which is charged to register a consumer reward denom in the step above."}),"\n",(0,s.jsxs)(n.li,{children:["Create a function called TransferRewardsToFeeCollector which gets the entire ConsumerRewardDenoms set from the store, iterates over it, and for each entry:","\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Gets the balance of this denom for the ConsumerRewardPool account"}),"\n",(0,s.jsx)(n.li,{children:"Sends the entire balance out to the FeePoolAddress using SendCoinsFromModuleToModule which is not affected by the blocklist."}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.li,{children:"Run TransferRewardsToFeeCollector in the endblock"}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Now, nobody can send millions of junk denoms to the FeePoolAddress because it is on the block list. If they send millions of junk denoms to the ConsumerRewardPool, this does not matter because all balances are not iterated over, only those which are in the ConsumerRewardDenoms set."}),"\n",(0,s.jsx)(n.p,{children:"We also add a new tx: register-consumer-reward-denom, and a new query: registered-consumer-reward-denoms"}),"\n",(0,s.jsx)(n.h3,{id:"consumer",children:"Consumer"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Create a new param RewardDenoms with a list of strings"}),"\n",(0,s.jsx)(n.li,{children:"Create a new param ProviderRewardDenoms with a list of strings"}),"\n",(0,s.jsx)(n.li,{children:"Create a function AllowedRewardDenoms which iterates over ProviderRewardDenoms and converts each denom to its ibc-prefixed denom using the provider chain's ibc channel information, then concatenates the RewardDenoms list and returns the combined list of allowed denoms."}),"\n",(0,s.jsx)(n.li,{children:"In SendRewardsToProvider, instead of iterating over the balances of all denoms in the ToSendToProvider address, iterate over AllowedRewardDenoms"}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Now, if somebody sends millions of junk denoms to ToSendToProvider, they will not be iterated over. Only the RewardDenoms and ProviderRewardDenoms will be iterated over. Since we do not require this feature to be permissionless on the consumer, the registration fee process is not needed."}),"\n",(0,s.jsx)(n.h2,{id:"consequences",children:"Consequences"}),"\n",(0,s.jsx)(n.h3,{id:"positive",children:"Positive"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Denom DOS is no longer possible on either provider or consumer."}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"negative",children:"Negative"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Consumer chain teams must pay a fee to register a denom for distribution on the provider, and add some extra parameters in their genesis file."}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(c,{...e})}):c(e)}},11151:(e,n,i)=>{i.d(n,{Z:()=>d,a:()=>t});var s=i(67294);const o={},r=s.createContext(o);function t(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:t(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);