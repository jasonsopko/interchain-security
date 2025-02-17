"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[211],{51980:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>t,default:()=>h,frontMatter:()=>r,metadata:()=>a,toc:()=>d});var i=s(85893),o=s(11151);const r={sidebar_position:13,title:"Separate Releasing"},t="ADR 012: Separate Releasing",a={id:"adrs/adr-012-separate-releasing",title:"Separate Releasing",description:"Changelog",source:"@site/versioned_docs/version-v6.4.0/adrs/adr-012-separate-releasing.md",sourceDirName:"adrs",slug:"/adrs/adr-012-separate-releasing",permalink:"/interchain-security/v6.4.0/adrs/adr-012-separate-releasing",draft:!1,unlisted:!1,tags:[],version:"v6.4.0",sidebarPosition:13,frontMatter:{sidebar_position:13,title:"Separate Releasing"},sidebar:"tutorialSidebar",previous:{title:"Improving testing and increasing confidence",permalink:"/interchain-security/v6.4.0/adrs/adr-011-improving-test-confidence"},next:{title:"Slashing on the provider for consumer equivocation",permalink:"/interchain-security/v6.4.0/adrs/adr-013-equivocation-slashing"}},l={},d=[{value:"Changelog",id:"changelog",level:2},{value:"Status",id:"status",level:2},{value:"Context",id:"context",level:2},{value:"Spike results",id:"spike-results",level:3},{value:"Why go.mod split is not the way to go",id:"why-gomod-split-is-not-the-way-to-go",level:3},{value:"Why separate repos is cool but also not the way to go",id:"why-separate-repos-is-cool-but-also-not-the-way-to-go",level:3},{value:"Decision",id:"decision",level:2},{value:"Example release flow",id:"example-release-flow",level:3},{value:"Consequences",id:"consequences",level:2},{value:"Positive",id:"positive",level:3},{value:"Negative",id:"negative",level:3},{value:"Neutral",id:"neutral",level:3},{value:"References",id:"references",level:2}];function c(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",strong:"strong",ul:"ul",...(0,o.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"adr-012-separate-releasing",children:"ADR 012: Separate Releasing"}),"\n",(0,i.jsx)(n.h2,{id:"changelog",children:"Changelog"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[8/18/22,": Initial draft of idea in ",(0,i.jsx)(n.a,{href:"https://github.com/cosmos/interchain-security/issues/801",children:"#801"})]}),"\n",(0,i.jsxs)(n.li,{children:[8/22/22,": Put idea in this ADR"]}),"\n",(0,i.jsxs)(n.li,{children:[.05,": Reject this ADR"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"status",children:"Status"}),"\n",(0,i.jsx)(n.p,{children:"Rejected"}),"\n",(0,i.jsx)(n.h2,{id:"context",children:"Context"}),"\n",(0,i.jsx)(n.h3,{id:"spike-results",children:"Spike results"}),"\n",(0,i.jsxs)(n.p,{children:["I explored the idea of ",(0,i.jsx)(n.a,{href:"https://github.com/cosmos/interchain-security/issues/801",children:"#801"})," with this ",(0,i.jsx)(n.a,{href:"https://github.com/cosmos/interchain-security/tree/shawn%2Fgo-mod-split-aug-spike",children:"spike branch"}),". Here's my conclusions:"]}),"\n",(0,i.jsxs)(n.p,{children:["Splitting this repo to have multiple go.mods is possible. However there are various intricacies involved in decoupling the package hierarchy to have ",(0,i.jsx)(n.code,{children:"x/ccv/types"})," as the lowest level dep, with ",(0,i.jsx)(n.code,{children:"x/ccv/consumer"})," and ",(0,i.jsx)(n.code,{children:"x/ccv/provider"})," being one dep layer above, with high-level tests depending on all three of the mentioned packages. I'd estimate this decoupling would take 2-5 workdays to finish, and require significant review effort."]}),"\n",(0,i.jsx)(n.h3,{id:"why-gomod-split-is-not-the-way-to-go",children:"Why go.mod split is not the way to go"}),"\n",(0,i.jsxs)(n.p,{children:["Let's take a step back and remember the issue we're trying to solve - ",(0,i.jsx)(n.strong,{children:"We need a clean way to decouple semver/releasing for the consumer and provider modules"}),". After more consideration, splitting up go.mods gives us little benefit in achieving this. Reasons:"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["The ",(0,i.jsx)(n.code,{children:"go.mod"})," dependency system is tied to git tags for the entire repo (ex: ",(0,i.jsx)(n.code,{children:"require github.com/cometbft/cometbft v0.37.2"})," refers to a historical tag for the entire cometbft repo)."]}),"\n",(0,i.jsx)(n.li,{children:"It'd be an odd dev experience to allow modules to reference past releases of other modules in the same repo. When would we ever want the consumer module to reference a past release of the types module for example?"}),"\n",(0,i.jsxs)(n.li,{children:["If we allow for ",(0,i.jsx)(n.code,{children:"go.mod"})," replace statements to build from local source code, why split up the package deps at all?"]}),"\n",(0,i.jsxs)(n.li,{children:["Splitting go.mods adds a bunch of complexity with ",(0,i.jsx)(n.code,{children:"go.work"})," files and all that shiz. VSCode does not play well with multiple module repos either."]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"why-separate-repos-is-cool-but-also-not-the-way-to-go",children:"Why separate repos is cool but also not the way to go"}),"\n",(0,i.jsxs)(n.p,{children:["All this considered, the cleanest solution to decoupling semver/releasing for the consumer and provider modules would be to have multiple repos, each with their own go.mod (3-4 repos total including high level tests). With this scheme we could separately tag each repo as changes are merged, they could share some code from ",(0,i.jsx)(n.code,{children:"types"})," being an external dep, etc."]}),"\n",(0,i.jsx)(n.p,{children:"I don't think any of us want to split up the monorepo, that's a lot of work and seems like bikeshedding. There's another solution that's very simple.."}),"\n",(0,i.jsx)(n.h2,{id:"decision",children:"Decision"}),"\n",(0,i.jsxs)(n.p,{children:["Slightly adapting ",(0,i.jsx)(n.a,{href:"https://github.com/cosmos/interchain-security/blob/cca008d856e3ffc60ec1a486871d0faa702abe26/CONTRIBUTING.md#semantic-versioning",children:"the current semver ruleset"}),":"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"A library API breaking change to EITHER the provider or consumer module will result in an increase of the MAJOR version number for BOTH modules (X.y.z-provider AND X.y.z-consumer)."}),"\n",(0,i.jsx)(n.li,{children:"A state breaking change (change requiring coordinated upgrade and/or state migration) will result in an increase of the MINOR version number for the AFFECTED module(s) (x.Y.z-provider AND/OR x.Y.z-consumer)."}),"\n",(0,i.jsx)(n.li,{children:"Any other changes (including node API breaking changes) will result in an increase of the PATCH version number for the AFFECTED module(s) (x.y.Z-provider AND/OR x.y.Z-consumer)."}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"example-release-flow",children:"Example release flow"}),"\n",(0,i.jsxs)(n.p,{children:["We upgrade ",(0,i.jsx)(n.code,{children:"main"})," to use a new version of SDK. This is a major version bump, triggering a new release for both the provider and consumer modules, ",(0,i.jsx)(n.code,{children:"v5.0.0-provider"})," and ",(0,i.jsx)(n.code,{children:"v5.0.0-consumer"}),"."]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["A state breaking change is merged to ",(0,i.jsx)(n.code,{children:"main"})," for the provider module. We release only a ",(0,i.jsx)(n.code,{children:"v5.1.0-provider"})," off main."]}),"\n",(0,i.jsxs)(n.li,{children:["Another state breaking change is merged to ",(0,i.jsx)(n.code,{children:"main"})," for the provider module. We release only a ",(0,i.jsx)(n.code,{children:"v5.2.0-provider"})," off main."]}),"\n",(0,i.jsxs)(n.li,{children:["At this point, the latest consumer version is still ",(0,i.jsx)(n.code,{children:"v5.0.0-consumer"}),". We now merge a state breaking change for the consumer module to ",(0,i.jsx)(n.code,{children:"main"}),", and consequently release ",(0,i.jsx)(n.code,{children:"v5.1.0-consumer"}),". Note that ",(0,i.jsx)(n.code,{children:"v5.1.0-consumer"})," is tagged off a LATER commit from main than ",(0,i.jsx)(n.code,{children:"v5.2.0-provider"}),". This is fine, as the consumer module should not be affected by the provider module's state breaking changes."]}),"\n",(0,i.jsxs)(n.li,{children:["Once either module sees a library API breaking change, we bump the major version for both modules. For example, we merge a library API breaking change to ",(0,i.jsx)(n.code,{children:"main"})," for the provider module. We release ",(0,i.jsx)(n.code,{children:"v6.0.0-provider"})," and ",(0,i.jsx)(n.code,{children:"v6.0.0-consumer"})," off main. Note that most often, a library API breaking change will affect both modules simultaneously (example being bumping sdk version)."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"consequences",children:"Consequences"}),"\n",(0,i.jsx)(n.h3,{id:"positive",children:"Positive"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Consumer repos have clear communication of what tagged versions are relevant to them. Consumer devs should know to never reference an ICS version that starts with ",(0,i.jsx)(n.code,{children:"provider"}),", even if it'd technically build."]}),"\n",(0,i.jsx)(n.li,{children:"Consumer and provider modules do not deviate as long as we continually release off a shared main branch. Backporting remains relatively unchanged besides being explicit about what module(s) your changes should affect."}),"\n",(0,i.jsx)(n.li,{children:"No code changes, just changes in process. Very simple."}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"negative",children:"Negative"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"~~Slightly more complexity.~~Considerably more complex to manage the ICS library.\nThis is because ICS needs to support multiple versions of SDK (e.g., 0.45, 0.47, 0.50).\nIn addition, ICS needs to support a special fork of SDK (with LSM included) for the Cosmos Hub.\nThis means that instead of focusing on main the development team needs to manage multiple release\nbranches with different dependency trees."}),"\n",(0,i.jsx)(n.li,{children:"This solution does not allow having provider and consumer on separate versions of e.g. the Cosmos SDK."}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"neutral",children:"Neutral"}),"\n",(0,i.jsx)(n.h2,{id:"references",children:"References"}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsx)(n.p,{children:"Are there any relevant PR comments, issues that led up to this, or articles referenced for why we made the given design choice? If so link them here!"}),"\n"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://github.com/cosmos/interchain-security/issues/801",children:"#801"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.a,{href:"https://github.com/cosmos/interchain-security/issues/801#issuecomment-1683349298",children:"#801 comment"})}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}},11151:(e,n,s)=>{s.d(n,{Z:()=>a,a:()=>t});var i=s(67294);const o={},r=i.createContext(o);function t(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:t(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);