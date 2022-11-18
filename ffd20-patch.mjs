var v=Object.defineProperty;var d=(s,t)=>v(s,"name",{value:t,configurable:!0});var D=(s,t)=>()=>(s&&(t=s(s=0)),t);var T={};function k(s,t,...e){let i=game.release.generation>=10?"system":"data",a=t[i]?.range?.maxIncrements;return a!==void 0&&(t[`${i}.range.maxIncrements`]=a,delete t[i].range.maxIncrements,isObjectEmpty(t[i].range)&&delete t[i].range,isObjectEmpty(t[i])&&delete t[i]),s(t,...e)}var y=D(()=>{"use strict";console.log("FFD20 PATCH \u{1FA79} | Applying Item Range migration fix");d(k,"fixItemUpdate");libWrapper.register("ffd20-patch","CONFIG.Item.documentClass.prototype.update",k)});Hooks.once("init",()=>{game.release.generation>=10||game.system.data?.version==="9.0.0"&&Hooks.once("ffd20.postInit",()=>{console.log("FFD20 PATCH \u{1FA79} | Misparsed shield data in getRollData: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1420"),game.ffd20.documents.ActorFFD20.prototype.getRollData=d(function(t={refresh:!1}){let e,i=!t.refresh&&this._rollData;if(i){e=this._rollData;let c=CONFIG.FFD20.temporaryRollDataFields.actor;for(let r of c){let m=r.split("."),n=m.slice(0,-1).join("."),f=m.slice(-1)[0];if(n==="")delete e[r];else{let p=getProperty(e,n);typeof p=="object"&&delete p[f]}}}else e=deepClone(this.data.data);if(game.combats?.viewed&&(e.combat={round:game.combat.round||0}),setProperty(e,"conditions.loseDexToAC",this.flags.loseDexToAC),i)return e;{let c=Object.keys(CONFIG.FFD20.sizeChart);e.size=c.indexOf(e.traits.size)}e.armor={type:0},e.shield={type:0};let a=e.equipment.armor.id,u=e.equipment.shield.id,o={total:Number.NEGATIVE_INFINITY,ac:0,enh:0},h=a?this.items.get(a):null;if(h){e.armor.type=e.equipment.armor.type;let c=h.data.data,r=c.armor.enh??0,m=c.armor.value??0,n=m+r;o.total<n&&(o.ac=m,o.total=n,o.enh=r)}Number.isFinite(o.total)||(o.total=0),mergeObject(e.armor,o);let l=u?this.items.get(u):null,g={total:Number.NEGATIVE_INFINITY,ac:0,enh:0};if(l){e.shield.type=e.equipment.shield.type;let c=l.data.data,r=c.armor.enh??0,m=c.armor.value??0,n=m+r;g.total<n&&(g.ac=m,g.total=n,g.enh=r)}mergeObject(e.shield,g),e.spells=e.attributes.spells.spellbooks;for(let[c,r]of Object.entries(e.spells))r.abilityMod=e.abilities[r.ability]?.mod??0,r.class&&r.class!=="_hd"&&(e.spells[r.class]??=r);return this.itemFlags&&(e.dFlags=this.itemFlags.dictionary),e.range=this.constructor.getReach(this.data.data.traits.size,this.data.data.traits.stature),this._rollData=e,Hooks.callAll("ffd20.getRollData",this,e,!0),e},"getRollData")})});Hooks.once("init",()=>{game.release?.generation>=10||game.system.data?.version==="9.0.0"&&Hooks.once("ffd20.postInit",()=>{console.log("FFD20 PATCH \u{1FA79} | Token vision update breaks with actorless tokens: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1429");let s=CONFIG.Token.objectClass.prototype.updateVisionSource;CONFIG.Token.objectClass.prototype.updateVisionSource=function(...t){return this.actor?s.call(this,...t):CONFIG.Token.objectClass.__proto__.prototype.updateVisionSource.call(this,...t)}})});Hooks.once("init",()=>{game.release?.generation>=10||!["9.0.0"].includes(game.system.data?.version)||Hooks.once("ffd20.postInit",()=>{console.log("FFD20 PATCH \u{1FA79} | Basic actors behave badly with LLV: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1435"),CONFIG.Canvas.layers.sight.layerClass.prototype.lowLightMultiplier=function(){let s={dim:1,bright:1},t=canvas.tokens.placeables.filter(i=>i.actor&&i.actor.testUserPermission(game.user,"OBSERVER")),e=t.filter(i=>!!i.actor&&i.actor.type!=="basic"&&i.actor.data.data.traits.senses.ll.enabled);if(game.user.isGM||game.settings.get("ffd20","lowLightVisionMode"))for(let i of e.filter(a=>a._controlled)){let a=i.actor?.data.data.traits.senses.ll.multiplier.dim||2,u=i.actor?.data.data.traits.senses.ll.multiplier.bright||2;s.dim=Math.max(s.dim,a),s.bright=Math.max(s.bright,u)}else{let i=t.filter(o=>o._controlled).length>0,a=e.filter(o=>o._controlled).length>0,u=e.length>0;if(!i&&u||a)for(let o of e){let h=o.actor?.data.data.traits.senses.ll.multiplier.dim||2,l=o.actor?.data.data.traits.senses.ll.multiplier.bright||2;s.dim=Math.max(s.dim,h),s.bright=Math.max(s.bright,l)}}return s}})});function C(s,t,...e){return t.class==="RollFFD$20"&&(t.class="RollFFD20"),s(t,...e)}d(C,"fixRollFFD20");Hooks.once("init",()=>{(game.system.version??game.system.data.version)==="10.1.1"&&(console.log("FFD20 PATCH \u{1FA79} | Overloading Roll.fromData to mitigate RollFFD$20 errors"),libWrapper.register("ffd20-patch","Roll.fromData",C,libWrapper.WRAPPER))});Hooks.once("init",()=>{if((game.release?.generation??8)<10||isNewerVersion("10.1.2",game.system.version))return;console.log("FFD20 PATCH \u{1FA79} | Re-enabling vision settings: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1681");let s=d(e=>e.disabled=!1,"reEnableElement"),t=d(e=>{setTimeout(()=>{e.querySelector('.tab[data-tab="vision"]').querySelectorAll("input,select").forEach(a=>{a.name!="sight.visionMode"&&(a.disabled==!1?setTimeout(()=>s(a),500):a.disabled=!1)})},200)},"reEnableVision");Hooks.on("renderTokenConfig",async(e,[i])=>t(i))});Hooks.once("init",()=>{if((game.release?.generation??8)<10||isNewerVersion("10.1.2",game.system.version))return;console.log("FFD20 PATCH \u{1FA79} | Keep advanced config: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1692"),console.log("FFD20 PATCH \u{1FA79} | Keep basic vision range: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1693"),console.log("FFD20 PATCH \u{1FA79} | Allow disabling vision: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1695");function s(){if(!["character","npc"].includes(this.actor?.type)||this.getFlag("ffd20","customVisionRules")||!this.sight.enabled)return;this.sight.visionMode="basic";let e=this.sight.range,i=this.actor?.system?.traits?.senses?.dv??0;i>0&&(this.sight.range=Math.max(e,ffd20.utils.convertDistance(i)[0]),this.sight.visionMode="darkvision",this.sight.saturation=-1);let a=DetectionMode.BASIC_MODE_ID,u=this.detectionModes.find(f=>f.id===a);u?u.range=e:this.detectionModes.push({id:a,enabled:!0,range:e});let o="seeInvisibility",h=this.detectionModes.find(f=>f.id===o);!h&&(this.actor?.system?.traits?.senses?.si||this.actor?.system?.traits?.senses?.tr)?this.detectionModes.push({id:o,enabled:!0,range:this.sight.range}):h!=null&&(this.actor?.system?.traits?.senses?.si||this.actor?.system?.traits?.senses?.tr?h.range=this.sight.range:this.detectionModes.splice(this.detectionModes.indexOf(h,1)));let l="blindSense",g=this.detectionModes.find(f=>f.id===l);!g&&this.actor?.system?.traits?.senses?.bse?this.detectionModes.push({id:l,enabled:!0,range:this.actor.system.traits.senses.bse}):g!=null&&(this.actor?.system?.traits?.senses?.bse?g.range=this.actor.system.traits.senses.bse:this.detectionModes.splice(this.detectionModes.indexOf(g,1)));let c="blindSight",r=this.detectionModes.find(f=>f.id===c);!r&&this.actor?.system?.traits?.senses?.bs?this.detectionModes.push({id:c,enabled:!0,range:this.actor.system.traits.senses.bs}):r!=null&&(this.actor?.system?.traits?.senses?.bs?r.range=this.actor.system.traits.senses.bs:this.detectionModes.splice(this.detectionModes.indexOf(r,1)));let m="feelTremor",n=this.detectionModes.find(f=>f.id===m);!r&&this.actor?.system?.traits?.senses?.ts?this.detectionModes.push({id:m,enabled:!0,range:this.actor.system.traits.senses.ts}):n!=null&&(this.actor?.system?.traits?.senses?.ts?n.range=this.actor.system.traits.senses.ts:this.detectionModes.splice(this.detectionModes.indexOf(n,1))),this.detectionModes.sort(this._sortDetectionModes.bind(this))}d(s,"refreshDetectionModes");let t=ffd20.documents.TokenDocumentFFD20.prototype.refreshDetectionModes;ffd20.documents.TokenDocumentFFD20.prototype.refreshDetectionModes=s});function M(s){return this.object?.document?.getFlag("ffd20","disableLowLight")?{dim:this.data.dim,bright:this.data.bright}:s.call(this)}d(M,"getRadiusLLVFix");var I=d(()=>{if(game.release.generation>=10){if(isNewerVersion(game.system.version,"10.1.2"))return;console.log("FFD20 PATCH \u{1FA79} | Fxing light source disable low-light toggle: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1736"),libWrapper.register("ffd20-patch","LightSource.prototype.getRadius",M,libWrapper.MIXED)}},"fixDisableLowLight");Hooks.once("init",I);console.log("FFD20 PATCH \u{1FA79} | Blindsense/Blindsight ignores walls");Hooks.once("ffd20PostInit",()=>{(game.release?.generation??8)<10||isNewerVersion("10.1.2",game.system.version)||(CONFIG.Canvas.detectionModes.blindSense.walls=!0,CONFIG.Canvas.detectionModes.blindSight.walls=!0)});Hooks.once("ffd20PostInit",()=>{if((game.release?.generation??8)<10||isNewerVersion("10.1.2",game.system.version))return;console.log("FFD20 PATCH \u{1FA79} | Stacking bonuses fix: https://gitlab.com/foundryvtt_pathfinder1e/foundryvtt-pathfinder1/-/issues/1749");function s(t,e=null,{applySourceInfo:i=!0}={}){e||(e=ffd20.documents.actor.changes.getChangeFlat.call(t,this.subTarget,this.modifier),e instanceof Array||(e=[e]));let a=this.parent?this.parent.getRollData({refresh:!0}):t.getRollData({refresh:!0}),u=t.changeOverrides;for(let o of e){let h=u[o];if(!u||h){let l=this.operator;l==="+"&&(l="add"),l==="="&&(l="set");let g=o!=null?o.match(/^system\.abilities\.([a-zA-Z\d]+)\.(?:total|penalty|base)$/):null,c=g!=null,r=g?.[1],m=c?deepClone(t.system.abilities[r]):null,n=0;if(this.formula)if(l==="script")if(!game.settings.get("ffd20","allowScriptChanges"))ui.notifications?.warn(game.i18n.localize("SETTINGS.ffd20AllowScriptChangesE"),{console:!1}),console.warn(game.i18n.localize("SETTINGS.ffd20AllowScriptChangesE"),this.parent),n=0,l="add";else{let b=this.createFunction(this.formula,["d","item"])(a,this.parent);n=b.value,l=b.operator}else l==="function"?(n=this.formula(a,this.parent),l="add"):isNaN(this.formula)?this.isDeferred?n=RollFFD20.replaceFormulaData(this.formula,a,{missing:0}):n=RollFFD20.safeRoll(this.formula,a,[o,this,a],{suppressError:this.parent&&!this.parent.testUserPermission(game.user,"OWNER")}).total:n=parseFloat(this.formula);if(this.data.value=n,!o)continue;let f=h[l][this.modifier]??0;switch(l){case"add":{let p=getProperty(t,o);if(p==null){if(o.match(/^system\.abilities/))continue;p=0}if(typeof p=="number")if(CONFIG.FFD20.stackingBonusModifiers.indexOf(this.modifier)!==-1)setProperty(t,o,p+n),h[l][this.modifier]=f+n;else{let b=f?Math.max(0,n-f):n;setProperty(t,o,p+b),h[l][this.modifier]=Math.max(f,n)}}break;case"set":setProperty(t,o,n),h[l][this.modifier]=n;break}if(i&&this.applySourceInfo(t,n),c){let p=ffd20.utils.getAbilityModifier(m.total,{damage:m.damage,penalty:m.penalty}),b=t.system.abilities[r],F=ffd20.utils.getAbilityModifier(b.total,{damage:b.damage,penalty:b.penalty});setProperty(t,`system.abilities.${r}.mod`,getProperty(t,`system.abilities.${r}.mod`)-(p-F))}}}}d(s,"fixedApplyChange"),ffd20.components.ItemChange.prototype.applyChange=s});console.log("FFD20 PATCH \u{1FA79} | Initializing");Hooks.once("init",d(function(){let t=game.system.version??game.system.data.version;import(`./ffd20/${t}.mjs`).catch(e=>console.warn(`FFD20 PATCH \u{1FA79} | Not available for FFD20 version ${t}`,e)),isNewerVersion("9.1.0",t)&&Promise.resolve().then(()=>(y(),T))},"patchInit"));
//# sourceMappingURL=ffd20-patch.mjs.map
