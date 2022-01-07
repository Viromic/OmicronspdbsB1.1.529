// https://observablehq.com/@aglucaci/sc2-omicron@3792
import define1 from "./715b4c45cc45c3b3@223.js";
import define2 from "./e93997d5089d7165@2303.js";
import define3 from "./a33468b95d0b15b0@808.js";
import define4 from "./20f78e399de08ef0@857.js";
import define5 from "./18a773173d4cbdab@53.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md","cladeName"], function(md,cladeName){return(
md`# Visualizing selection analysis results for evolution of the ${cladeName} (WHO Omicron) clade
`
)});
  main.variable(observer("viewof analysis_name")).define("viewof analysis_name", ["select"], function(select)
{
  const dd3 = select({
    title: "Display this analysis.",
    options: [
      { label: "BA.1 (all sequences through 12.20.2021)", value: 'BA.1-12202021'},
      { label: "BA.1 (all sequences through 12.19.2021)", value: 'BA.1-12192021'},
      { label: "BA.1 (all sequences through 12.18.2021)", value: 'BA.1-12182021'},
      { label: "BA.1 (all sequences as of 12.17.2021)", value: 'BA.1-12172021'},
      { label: "BA.1 (all sequences as of 12.16.2021)", value: 'BA.1-12162021'},
      { label: "BA.1 (all sequences as of 12.15.2021)", value: 'BA.1-12152021'},
      { label: "BA.1 (all sequences as of 12.14.2021)", value: 'BA.1-12142021'},
      { label: "BA.1 (all sequences as of 12.13.2021)", value: 'BA.1-12132021'},
      { label: "BA.1 (all sequences as of 12.08.2021)", value: 'BA.1-12082021'},
      { label: "B.1.1.529 (all sequences as of 12.07.2021)", value: 'B.1.1.529-12072021'},    
      { label: "B.1.1.529 (all sequences as of 12.05.2021)", value: 'B.1.1.529-12052021'},
      { label: "B.1.1.529 (all sequences as of 12.03.2021)", value: 'B.1.1.529-12032021'},
      { label: "B.1.1.529 (all sequences as of 12.01.2021)", value: 'B.1.1.529-12012021'},
      { label: "B.1.1.529 (all sequences as of 11.29.2021)", value: 'B.1.1.529-11292021'},
      { label: "B.1.1.529 (all sequences as of 11.27.2021)", value: 'B.1.1.529-11272021'},
      { label: "B.1.1.529 (all sequences as of 11.25.2021)", value: 'B.1.1.529'}
    ]
  });
  dd3.input.style.fontSize = "18px";
  return dd3;
}
);
  main.variable(observer("analysis_name")).define("analysis_name", ["Generators", "viewof analysis_name"], (G, _) => G.input(_));
  main.variable(observer("analysis_info")).define("analysis_info", ["analysis_name","md","d3","_"], async function*(analysis_name,md,d3,_)
{
  let base_url = "https://data.hyphy.org/web/RASCL/";
  let urls = analysis_name;
  
  yield md`>Loading summary data...<div style='height: 2000px'></div>`; 
  let summary = await d3.json (base_url + analysis_name + "_summary.json");
  yield summary
  
  yield md`>Loading annotation data...<div style='height: 2000px'></div>`;
  let annotation = await d3.json ((base_url + analysis_name + "_annotation.json"));
  annotation = _.chain (annotation).toPairs().filter ((d)=>'bFEL' in d[1]).fromPairs().value();
  
  let res = md`Loaded data on ${_.size(summary)} segments and ${_.size(annotation)} sites`;
  res.s = summary;
  res.a = annotation;
  res.b = base_url;
  yield res;
}
);
  main.variable(observer()).define(["md","cladeName","d3","speciesCount","selected_sites","polymorphic_sites","has_full_meme","selected_sites_leaves","diff_sites","directional_sites","coevolve_sites","negative_sites","_","busted_distribution_summary"], function(md,cladeName,d3,speciesCount,selected_sites,polymorphic_sites,has_full_meme,selected_sites_leaves,diff_sites,directional_sites,coevolve_sites,negative_sites,_,busted_distribution_summary){return(
md`
** Objective. ** 

We investigated the nature and extent of selective forces acting on the viral genes in _${cladeName}_ clade sequences by performing a series of comparative phylogenetic analyses on a median of ${d3.median (speciesCount, d=>d[cladeName])} _${cladeName}_  sequences and a median of ${d3.median (speciesCount, d=>d["Reference"])} sequences from available sequences chosen to represent genomic diversity in SARS-CoV-2.

** Results. ** 

1. There is evidence of **diversifying positive selection** acting on the _${cladeName}_ sequences, on  **${selected_sites.length}** individual sites (there are ${polymorphic_sites.length} sites that are polymorphic in the amino-acid space among clade sequences; selection also includes the basal branch of the clade) along the internal branches of the clade ([Table 1](#table1)).
2. ${has_full_meme ? "There is evidence of **diversifying positive selection** acting on the _ " + cladeName + "_ sequences, on  **" + selected_sites_leaves.length +"** individual sites along **all** branches of the clade ([Table 7](#table7))." : "No full clade MEME data"}
3. When comparing the strength of selection on _${cladeName}_ to reference sequences along internal tree branches, **${diff_sites.length}** individual sites along the internal branches of the clade ([Table 2](#table2)) showed statistically significant differences.
4. Over the entire tree **${directional_sites.length}** sites show evidence of directional selection ([Table 3](#table3)). 
5. Along the internal branches of the _${cladeName}_ clade, **${coevolve_sites.length}** pairs of sites showed evidence of **coevolution** ([Table 4](#table4)). 
6. Along the internal branches of the _${cladeName}_ clade, **${negative_sites.length}** sites showed evidence of **negative selection** ([Table 5](#table5)). 
7. Along the internal branches of the _${cladeName}_ clade, **${_.filter (busted_distribution_summary, (d)=>d.q <= 0.1).length}** genes/ORFs showed evidence of **episodic diversifying selection** (BUSTED, q-value ≤ 0.1, [Table 6](#table6)). 
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Segment information`
)});
  main.variable(observer("viewof segment_id")).define("viewof segment_id", ["select","_","fragments"], function(select,_,fragments)
{
  const dd3 = select({
    title: "View this genomic segment",
    options: _.map (_.uniqBy (fragments,"0"), (g)=>g[0])
      
  });
  dd3.input.style.fontSize = "30px";
  dd3.input.style.marginTop = "8px";
  return dd3;
}
);
  main.variable(observer("segment_id")).define("segment_id", ["Generators", "viewof segment_id"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","float_format","summary_json","segment_id","cladeName"], function(md,float_format,summary_json,segment_id,cladeName){return(
md`The BUSTED p-value for episodic selection is **${float_format(summary_json[segment_id]["busted"]["p"])}**. The RELAX p-value is **${float_format(summary_json[segment_id]["relax"]["p"])}** and the relaxation/intensification parameters  was **${float_format(summary_json[segment_id]["relax"]["K"])}**, implying that selection in ${cladeName} was **${summary_json[segment_id]["relax"]["K"] > 1 ? "intensified" : "relaxed"}** relative to the reference branches.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`**Figure 0.** Segment alignment view`
)});
  main.variable(observer()).define(["html"], function(html){return(
html`<div id='alignment'>`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Site-level information`
)});
  main.variable(observer("viewof site2viewIDX")).define("viewof site2viewIDX", ["autoSelect","_","segment_id","site2segment","annotation_json"], function(autoSelect,_,segment_id,site2segment,annotation_json){return(
autoSelect({
  options:  _.flatten (["Overall for " + segment_id,_.map (site2segment, (v,k)=>k + " "  + annotation_json[k].G + "/" + annotation_json[k].S)]),
  title: `View this site (in SARS-CoV-2 reference coordinates)`,
  placeholder: "Select a site (or overall)"
})
)});
  main.variable(observer("site2viewIDX")).define("site2viewIDX", ["Generators", "viewof site2viewIDX"], (G, _) => G.input(_));
  main.variable(observer()).define(["site2view","md","annotation_json","float_format","report_ratio","cladeName","cfel_site_report","fade_site_report","prime_site_report","freq_report"], function(site2view,md,annotation_json,float_format,report_ratio,cladeName,cfel_site_report,fade_site_report,prime_site_report,freq_report)
{
  if (site2view.length) return md`Site **${site2view}**, codon **${annotation_json[site2view].S} in gene/ORF ${annotation_json[site2view].G}**. 
<br>
<span style = 'font-size: 125%'>Pervasive selection test</span>
<br>
<span style = 'margin-left: 2em'> FEL p-value ${float_format (annotation_json[site2view].bFEL.p)}, &omega; = ${report_ratio (annotation_json[site2view].bFEL.a, annotation_json[site2view].bFEL.b)}</span>
<br>

<span style = 'font-size: 125%'>Episodic diversifying selection test (internal branches)</span>
<br>
<span style = 'margin-left: 2em'>
MEME p-value ${float_format (annotation_json[site2view].bMEME.p)}, &omega; +  = ${report_ratio (annotation_json[site2view].bMEME["a"], annotation_json[site2view].bMEME["b+"])}, p = ${float_format (annotation_json[site2view].bMEME["w+"])}, **${annotation_json[site2view].bMEME.br}** selected branches</span>
${"lMEME" in annotation_json[site2view] ? 

    "<br><span style = 'font-size: 125%'>Episodic diversifying selection test (all branches)</span><br><span style = 'margin-left: 2em'>MEME p-value (all branches) " + float_format (annotation_json[site2view].lMEME.p) + ", &omega; +  = " + report_ratio (annotation_json[site2view].lMEME['a'], annotation_json[site2view].lMEME['b+'])  + ", p = " + float_format (annotation_json[site2view].lMEME['w+']) + ", ** " + annotation_json[site2view].lMEME.br +" ** selected branches</span>" : ""}
<br>

<span style = 'font-size: 125%'>Test for different selective pressures between ${cladeName} and reference branches</span>
<br>
<span style = 'margin-left: 2em'> 
${cfel_site_report(site2view)}
</span>
<br>
<span style = 'font-size: 125%'>Directional selection test</span>
<br>
<span style = 'margin-left: 2em'> 
${fade_site_report(site2view)}
</span>
<br>
<span style = 'font-size: 125%'>Property importance test</span>
<br>
<span style = 'margin-left: 2em'> 
${prime_site_report(site2view)}
</span>

<br><span style = 'font-size: 125%'>Amino-acid composition</span>

<dl style = 'margin-left: 2em'>
<dt>_${cladeName}_</dt><dd>${freq_report (annotation_json [site2view].aa[cladeName])} </dd>
<dt>_Reference_</dt><dd>${freq_report (annotation_json [site2view].aa["Reference"])} </dd>
</dl>
`;
  
 return md`Select a site to view detailed information on it`;
}
);
  main.variable(observer("viewof treeDim")).define("viewof treeDim", ["text"], function(text){return(
text({placeholder : "1024 x 800", description: "Tree dimension (height x width in pixels), leave blank to auto-scale", submit: "Resize"})
)});
  main.variable(observer("treeDim")).define("treeDim", ["Generators", "viewof treeDim"], (G, _) => G.input(_));
  main.variable(observer("viewof doAA")).define("viewof doAA", ["checkbox"], function(checkbox){return(
checkbox({
  options: [{ value: "toggle", label: "Label tree with amino-acids" }]
})
)});
  main.variable(observer("doAA")).define("doAA", ["Generators", "viewof doAA"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`<small>Branches that have experienced at least one substittuion are shown in thicker lines. Branches that have MEME-based support for episodic selection at a given site, are shown in <span style = 'color: darkred'>**dark red**</span>. Mouse over branches to show additional information if available (e.g substitutions over those branches, and MEME episodic selection support).</small>`
)});
  main.variable(observer("trendLegend")).define("trendLegend", ["swatches","species_colors"], function(swatches,species_colors){return(
swatches({
  color: species_colors,
  title: "Viral species",
  //tickFormat: "%"
})
)});
  main.variable(observer()).define(["html","resolve"], function(html,resolve){return(
html`
      <link rel=stylesheet href='${resolve("phylotree@0.1/phylotree.css")}'>
      <div id="tree_container_0"></div>
`
)});
  main.variable(observer()).define(["html","resolve"], function(html,resolve){return(
html`
      <link rel=stylesheet href='${resolve("phylotree@0.1/phylotree.css")}'>
      <div id="tree_container"></div>`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Result tables`
)});
  main.variable(observer("table1")).define("table1", ["md","cladeName"], function(md,cladeName){return(
md`**Table 1** List of sites found to be under diversifying positive selection by [MEME](https://journals.plos.org/plosgenetics/article?id=10.1371/journal.pgen.1002764) (p≤0.05) along internal branches in _${cladeName}_, as well as biochemical properties that are _important_ at this site (via the [PRIME method](http://hyphy.org/w/index.php/PRIME))`
)});
  main.variable(observer()).define(["table","selected_sites","d3","_"], function(table,selected_sites,d3,_){return(
table (selected_sites,
      {
        limit: 5000,
        enableCSVDownload: true,
        sort: true,
        enableFilter: false,
        columns: [
          {
              key: 'coordinate',
              name: 'Coordinate (SARS-CoV-2)'
          },
          {
            key: 'gene',
            name: 'Gene/ORF'
      
          },
          {
            key: 'site',
            name: 'Codon (in gene/ORF)'
          },
          {
            key : 'meme_branches',
            name : '# of selected branches',
            render : (val)=>d3.format ("d") (val)
          },
          {
            key : 'p',
            name : 'p-value',
            render : (val)=>d3.format (".3g") (val)
          },
          {
            key : 'q',
            name : 'q-value',
            render : (val)=>d3.format (".3g") (val)
          },
          {
            key : 'prime',
            name : 'Properties',
            render : (val)=>_.map (val, (d)=>{if (d[2]) return d[0] + (d[2]>0 ? " (constrained) " : " (changing)"); else return 'overall';}).join (", ")
          }
        ]
})
)});
  main.variable(observer()).define(["md","cladeName"], function(md,cladeName){return(
md`
<small>
1. ** Coordinate (SARS-CoV-2)** : the starting coordinate of the codon in the NCBI reference SARS-CoV-2 genome
2. ** Gene/ORF ** : which gene or ORF does this site belong to
3. ** Codon (in gene/ORF) ** : the location of the codon in the corresponding Gene/ORF
4. ** % of branches with ω>1 ** : the fraction of tree branches (internal branches in the ${cladeName} clade) that have evidence of diversifying positive selection at this site (100% -- pervasive selection, <100% --episodic selection). 
5. ** p-value ** : the p-value for the likelihood ratio test that a non-zero fraction of branches have &omega; > 1 (i.e. episodic diversifying selection at this branch). This is not corrected for multiple testing; the MEME test is generally conservative on real data.
6. ** q-value ** : multiple-test corrected q-value (Benjamini-Hochberg)
7. ** Properties ** : which, if any, of the five compositive biochemical properties from [Atchley et al](https://www.pnas.org/content/102/18/6395) are conserved or changed at this site.
</small>`
)});
  main.variable(observer("table2")).define("table2", ["md","cladeName"], function(md,cladeName){return(
md`**Table 2** List of sites found to be selected differentially along internal branches between _${cladeName}_ and reference sequences (FDR ≤ 0.2) using the [Contrast-FEL method](https://dl.dropbox.com/s/o3q9fwgzur851eo/msaa263.pdf)`
)});
  main.variable(observer()).define(["table","diff_sites","cladeName","d3"], function(table,diff_sites,cladeName,d3){return(
table (diff_sites,
      {
        limit: 5000,
        enableCSVDownload: true,
        sort: true,
        enableFilter: false,
        columns: [
          {
              key: '0',
              name: 'Coordinate (SARS-CoV-2)'
          },
          {
              key: '6',
              name: 'Gene/ORF'
          },
          {
              key: '5',
              name: 'Codon (in gene/ORF)'
          },
          {
            key : '7',
            name : 'Ratio of &omega; (' + cladeName + ' : reference)',
          },
          {
            key : '4',
            name : 'p',
            render : (val)=>d3.format (".3g") (val)
          },
          {
            key : '8',
            name : 'q',
            render : (val)=>d3.format (".3g") (val)
          }
        ]
})
)});
  main.variable(observer()).define(["md","cladeName"], function(md,cladeName){return(
md`
<small>
1. ** Coordinate (SARS-CoV-2)** : the starting coordinate of the codon in the NCBI reference SARS-CoV-2 genome
2. ** Gene/ORF ** : which gene or ORF does this site belong to
3. ** Codon (in gene/ORF) ** : the location of the codon in the corresponding Gene/ORF
4. ** Ratio of ω (${cladeName} : reference) ** : the ratio of site-level &omega; estimates for the two sets of branches. If this ratio is >1, then selection on ${cladeName} is stronger. These values are highly imprecise and should be viewed as qualitative measures.
5. ** p-value ** : the p-value for the likelihood ratio test that &omega; ratios between the internal branches of the two clades are different. This is not corrected for multiple testing.
6. ** q-value ** : multiple-test corrected q-value (Benjamini-Hochberg)
</small>`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`<a name="table3"></a> **Table 3** List of sites found to be evolving under directional selection in the entire tree, using a FUBAR-like implementation of the [DEPS method](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2515872/). The tree was rooted on the genome reference sequence for this analysis.`
)});
  main.variable(observer()).define(["table","directional_sites"], function(table,directional_sites){return(
table (directional_sites,
      {
        limit: 5000,
        enableCSVDownload: true,
        sort: true,
        enableFilter: false,
        columns: [
          {
              key: '0',
              name: 'Coordinate (SARS-CoV-2)'
          },
          {
              key: '3',
              name: 'Gene/ORF'
          },
          {
              key: '4',
              name: 'Codon (in gene/ORF)'
          },
          {
            key : '1',
            name : 'Target amino-acids',
          }
        ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
<small>
1. ** Coordinate (SARS-CoV-2)** : the starting coordinate of the codon in the NCBI reference SARS-CoV-2 genome
2. ** Gene/ORF ** : which gene or ORF does this site belong to
3. ** Codon (in gene/ORF) ** : the location of the codon in the corresponding Gene/ORF
4. ** 	Target amino-acid ** : which amino-acids have statistical support (Bayes Factor ≥ 100) for accelerated evolution towards them.
</small>`
)});
  main.variable(observer("table4")).define("table4", ["md"], function(md){return(
md`**Table 4** Pairs of sites found to have epistatic (co-evolving) substitution patterns by [BGM method](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2732215/)`
)});
  main.variable(observer()).define(["table","coevolve_sites","d3"], function(table,coevolve_sites,d3){return(
table (coevolve_sites,
      {
        limit: 5000,
        enableCSVDownload: true,
        sort: true,
        enableFilter: false,
        columns: [
          {
              key: '10',
              name: 'Gene/ORF'
          },
          {
              key: '11',
              name: 'Codon 1 (in gene/ORF)'
          },
          {
              key: '12',
              name: 'Codon 2 (in gene/ORF)'
          },
          {
              key: '4',
              name: 'Posterior probability of non-independence',
              render : (val)=>d3.format (".3g") (val)
          },
        ]
})
)});
  main.variable(observer()).define(["md","cladeName"], function(md,cladeName){return(
md`
<small>
1. ** Gene/ORF ** : which gene or ORF does this site belong to
2. ** Codon 1/2 (in gene/ORF) ** : the location of the two interacting codons in the corresponding Gene/ORF
3. ** 	Posterior probability of non-independence ** : estimated posterior probability that substitutions which occur on the interior branches of the ${cladeName} clade are **not** independent.
</small>`
)});
  main.variable(observer("table5")).define("table5", ["md","cladeName"], function(md,cladeName){return(
md`**Table 5** List of sites found to be under pervasive negative selection by [FEL](https://academic.oup.com/mbe/article/22/5/1208/1066893) (p≤0.05) along internal branches in _${cladeName}_`
)});
  main.variable(observer()).define(["table","negative_sites","d3"], function(table,negative_sites,d3){return(
table (negative_sites,
      {
        limit: 5000,
        enableCSVDownload: true,
        sort: true,
        enableFilter: false,
        columns: [
          {
              key: 'coordinate',
              name: 'Coordinate (SARS-CoV-2)'
          },
          {
            key: 'gene',
            name: 'Gene/ORF'
      
          },
          {
            key: 'site',
            name: 'Codon (in gene/ORF)'
          },
          {
            key: 'alpha',
            name: 'Synonymous rate',
             render : (val)=>d3.format (".3g") (val)
          },
          {
            key: 'beta',
            name: 'Non-synonymous rate',
             render : (val)=>d3.format (".3g") (val)
          },
          {
            key : 'p',
            name : 'p-value',
            render : (val)=>d3.format (".3g") (val)
          },
          {
            key : 'q',
            name : 'q-value',
            render : (val)=>d3.format (".3g") (val)
          }
        ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
<small>
1. ** Coordinate (SARS-CoV-2)** : the starting coordinate of the codon in the NCBI reference SARS-CoV-2 genome
2. ** Gene/ORF ** : which gene or ORF does this site belong to
3. ** Codon (in gene/ORF) ** : the location of the codon in the corresponding Gene/ORF
4. ** Synonymous rate ** : Site estimate for the synonymous substitution rate (&alpha;). These values are highly imprecise and should be viewed as qualitative measures.
4. ** Non-synonymous rate ** : Site estimate for the non-synonymous substitution rate (&beta;). These values are highly imprecise and should be viewed as qualitative measures.
5. ** p-value ** : the p-value for the likelihood ratio test that &beta;/&alpha ≠ 1
6. ** q-value ** : multiple-test corrected q-value (Benjamini-Hochberg)
</small>`
)});
  main.variable(observer("table6")).define("table6", ["md"], function(md){return(
md`**Table 6** [BUSTED](https://academic.oup.com/mbe/article/32/5/1365/1134918) selection results on the SARS-CoV-2 clade across segments`
)});
  main.variable(observer()).define(["table","busted_distribution_summary","d3"], function(table,busted_distribution_summary,d3){return(
table (busted_distribution_summary,
      {
        limit: 5000,
        enableCSVDownload: true,
        sort: true,
        enableFilter: false,
        columns: [
          {
            key: 'file',
            name: 'Segment'
      
          },
          {
            key: 'omega1',
            name: '⍵1',
            render : (val)=>d3.format (".3g") (val)
          },
          {
            key: 'proportion1',
            name: 'p1',
            render : (val)=>d3.format (".3p") (val)
          },
          {
            key: 'omega2',
            name: '⍵2',
            render : (val)=>d3.format (".3g") (val)
          },
          {
            key: 'proportion2',
            name: 'p2',
            render : (val)=>d3.format (".3p") (val)
          },
          {
            key: 'omega3',
            name: '⍵3',
            render : (val)=>d3.format (".3g") (val)
          },
          {
            key: 'proportion3',
            name: 'p3',
            render : (val)=>d3.format (".3p") (val)
          },

          {
            key : 'p',
            name : 'p-value',
            render : (val)=>val <= 0.05 ? '<b>' + d3.format (".3g") (val) + '</b>' : d3.format (".3g") (val)
          },
          {
            key : 'q',
            name : 'q-value',
            render : (val)=>val <= 0.2 ? '<b>' + d3.format (".3g") (val) + '</b>' : d3.format (".3g") (val)
          },
        ]
})
)});
  main.variable(observer("table7")).define("table7", ["md","cladeName"], function(md,cladeName){return(
md`**Table 7** List of sites found to be under diversifying positive selection by [MEME](https://journals.plos.org/plosgenetics/article?id=10.1371/journal.pgen.1002764) (p≤0.05) along **all** branches in _${cladeName}_, as well as biochemical properties that are _important_ at this site (via the [PRIME method](http://hyphy.org/w/index.php/PRIME))`
)});
  main.variable(observer()).define(["table","selected_sites_leaves","d3","_"], function(table,selected_sites_leaves,d3,_){return(
table (selected_sites_leaves,
      {
        limit: 5000,
        enableCSVDownload: true,
        sort: true,
        enableFilter: false,
        columns: [
          {
              key: 'coordinate',
              name: 'Coordinate (SARS-CoV-2)'
          },
          {
            key: 'gene',
            name: 'Gene/ORF'
      
          },
          {
            key: 'site',
            name: 'Codon (in gene/ORF)'
          },
          {
            key : 'meme_branches',
            name : '# of selected branches',
            render : (val)=>d3.format ("d") (val)
          },
          {
            key : 'p',
            name : 'p-value',
            render : (val)=>d3.format (".3g") (val)
          },
          {
            key : 'pMEME',
            name : 'p-value/int',
            render : (val)=>d3.format (".3g") (val)
          },
          {
            key : 'q',
            name : 'q-value',
            render : (val)=>d3.format (".3g") (val)
          },
          {
            key : 'prime',
            name : 'Properties',
            render : (val)=>_.map (val, (d)=>{if (d[2]) return d[0] + (d[2]>0 ? " (constrained) " : " (changing)"); else return 'overall';}).join (", ")
          }
        ]
})
)});
  main.variable(observer()).define(["md","cladeName"], function(md,cladeName){return(
md`
<small>
1. ** Coordinate (SARS-CoV-2)** : the starting coordinate of the codon in the NCBI reference SARS-CoV-2 genome
2. ** Gene/ORF ** : which gene or ORF does this site belong to
3. ** Codon (in gene/ORF) ** : the location of the codon in the corresponding Gene/ORF
4. ** % of branches with ω>1 ** : the fraction of tree branches (internal branches in the ${cladeName} clade) that have evidence of diversifying positive selection at this site (100% -- pervasive selection, <100% --episodic selection). 
5. ** p-value ** : the p-value for the likelihood ratio test that a non-zero fraction of branches have &omega; > 1 (i.e. episodic diversifying selection at this branch). This is not corrected for multiple testing; the MEME test is generally conservative on real data.
6. ** p-value/int ** : the p-value for the likelihood ratio test that a non-zero fraction of **internal** branches have &omega; > 1 (i.e. episodic diversifying selection at this branch). This is not corrected for multiple testing; the MEME test is generally conservative on real data.
7. ** q-value ** : multiple-test corrected q-value (Benjamini-Hochberg)
8. ** Properties ** : which, if any, of the five compositive biochemical properties from [Atchley et al](https://www.pnas.org/content/102/18/6395) are conserved or changed at this site.
</small>`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
<hr/>
### Data and libraries 
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require ("d3")
)});
  main.variable(observer("phylotree")).define("phylotree", ["require"], function(require){return(
require ("https://dl.dropboxusercontent.com/s/i528j2lqnyzknit/phylotree.js")
)});
  main.variable(observer("_")).define("_", ["require"], function(require){return(
require("lodash")
)});
  main.variable(observer()).define(["html"], function(html){return(
html`
<link type="text/css" href="https://dl.dropbox.com/s/dkqqszx8jlmrf0u/phylotree.css" rel="stylesheet">
`
)});
  main.variable(observer("site2view")).define("site2view", ["site2viewIDX"], function(site2viewIDX){return(
site2viewIDX.split (" ")[0]
)});
  main.variable(observer("tree_object")).define("tree_object", ["phylotree","summary_json","site2segment","site2view","segment_id"], function(phylotree,summary_json,site2segment,site2view,segment_id){return(
[new phylotree.phylotree(summary_json[site2segment [site2view]? site2segment [site2view] : segment_id]["tree"]), summary_json[site2segment [site2view]? site2segment [site2view] : segment_id]["tree_tags"]]
)});
  main.variable(observer()).define(["treeDim","_","tree_object","summary_json","site2segment","site2view","segment_id","doAA","translation_table","d3","species_colors","subsByBranch","annotation_json"], function(treeDim,_,tree_object,summary_json,site2segment,site2view,segment_id,doAA,translation_table,d3,species_colors,subsByBranch,annotation_json)
{
  
    let dim = treeDim.length ? _.map (treeDim.split ("x"), (d)=>+d) : null;
    
    let tree = tree_object[0];
    var t = tree.render("#tree_container_0", dim ? {
    height:dim[0] || 1024, 
    width:dim[1] || 600,
    'show-scale' : true,
    'is-radial' : false,
    'left-right-spacing': 'fit-to-size', 
    'top-bottom-spacing': 'fit-to-size',
    'node_circle_size' : (n)=>0
   } : {
    //height:1024, 
    width:800,
    'show-scale' : true,
    'left-right-spacing': 'fit-to-size', 
    //'top-bottom-spacing': 'fit-to-size',
    'is-radial' : false,
    'node_circle_size' : (n)=>0
   });
  
    const bs = (n) => {
        if (tree.is_leafnode (n)) {
            return 3;
        }
        return 1;
    };
  
    let siteID = summary_json[site2segment [site2view]? site2segment [site2view] : segment_id].subs[site2view];
    let treeTags = summary_json [segment_id].tree_tags;
  
    let nodeStates = null;
    if (siteID) {
      nodeStates = {};
      let node_labels = siteID;
      function recurse_node (node) {
        if (node.data.name in node_labels) {
          nodeStates[node.data.name] = node_labels[node.data.name];
        } else {
          nodeStates[node.data.name] = nodeStates[node.parent.data.name];
        }
        _.each (node.children, (c)=>recurse_node(c)); 
      }

      recurse_node(tree.nodes);
      if (doAA) {
        for (let node in nodeStates) {
          nodeStates[node] = nodeStates[node] in translation_table ? translation_table[nodeStates[node]] : '?';
        }  
      }
    }
  
    let c10 = d3.scaleOrdinal(d3.schemeDark2);
  
    //var c10 = d3.scaleOrdinal(d3.schemeDark2);
    //t.node_label = n=>n.data.name.substr (0,3);
    t.node_bubble_size = bs;
    t.phylotree.node_bubble_size = bs;
    t.options["draw-size-bubbles"] = nodeStates ? true : false;
    //t.font_size = 8;
    //t.spacing_x (7);


    t.phylotree.branch_length_accessor = 
      n=> {
       //console.log (summary_json[segment_id]);

       let bl = tree_object[1][n.data.name][2];
       if (bl > 0.25) {
          n.data.censored_bl = true;
          return 0.25;
       } else {
         n.data.censored_bl = false;
       }
       return bl;
    }

    t.node_label ((n)=>{


      if (nodeStates) {
        return (n.data.name) in nodeStates ? nodeStates[n.data.name] : n.data.name;// + " (" + n.data.name + ")";
      }
      if (n.children && n.children.length) {return "";}
      let pieces = n.data.name.split ("_"); 
      if (n.data.name.indexOf ("epi") == 0) {
        return pieces[2] || ""; 
      }
      return pieces[pieces.length-4] || "";
      
      //return n.data.name;
      //return "";
    });



    function sort_nodes (asc) {
      tree.traverse_and_compute (function (n) {
              var d = 1;
              if (n.children && n.children.length) {
                  d += d3.max (n.children, function (d) { return d["count_depth"];});
              } 

              n["count_depth"] = d;
          });
      tree.resort_children (function (a,b) {
          return (a["count_depth"] - b["count_depth"]) * (asc ? 1 : -1);
      });
    }

    sort_nodes (true);


     tree.traverse_and_compute ((n) => {
        //if (!tree.is_leafnode (n) && !n.tagged_view && n.parent && n.parent.tagged_view) {
            //n.notshown = true; 
        //}
     });
  
     t.style_nodes ((e,n) => {
       if (n.data.name in tree_object[1]) {
          let binfo = tree_object[1][n.data.name];
          e.selectAll("text").selectAll("title").data([n.data.name]).enter().append("title").text ((d)=>d);
        if (nodeStates) {
          e.style ('fill', c10 (nodeStates[n.data.name]));
          if (binfo[0].length) {
               e.selectAll ("circle").style ('fill', species_colors (binfo[0]));
            }
        } else { 
            if (binfo[0].length) {
               e.style ('fill', species_colors (binfo[0]));
            }
        }
       }
       
       //}
     });

     t.style_edges ((e,d) => {
        let subs = subsByBranch[d.target.data.name],
            sub_count = 0,
            ttext = null;
        if (subs) {
          sub_count = subs.length;
          ttext = "Subs at " + subs.join (", "); 
        }
        if (d.target.data.name in treeTags) {
             if (treeTags[d.target.data.name][3].length) {
               ttext += "\nMEME selection at sites " + _.map (treeTags[d.target.data.name][3], (s)=>annotation_json [s].G + "/" + annotation_json [s].S).join (", "); 
             }
          sub_count = treeTags[d.target.data.name][3].length;
        }
        if (nodeStates) {
          if (nodeStates[d.target.data.name] != nodeStates[d.source.data.name]) {
              e.style ('stroke-width',5);
          } else {
              e.style ('stroke-width',null); 
          }
          if (d.target.data.name in treeTags) {
            if ( treeTags[d.target.data.name][3].indexOf (+site2view) >= 0) {
               e.style ('stroke','darkred'); 
            }
          }
        } else {
          if (d.target.data.name in tree_object[1]) {
            let binfo = tree_object[1][d.target.data.name];
            e.style ('stroke-width', 1 + sub_count);
          }

          //e.selectAll("title").text ("p = " + p);
        }
        if (d.target.data.censored_bl) {
            e.style ('stroke-dasharray',10);
        }
       
        if (ttext) {
          e.selectAll("title").text (ttext);
        }



    });
    t.placenodes();
    t.update();
    return t;
}
);
  const child1 = runtime.module(define1);
  main.import("table", child1);
  const child2 = runtime.module(define2);
  main.import("select", child2);
  main.import("checkbox", child2);
  main.import("autoSelect", child2);
  main.import("text", child2);
  main.variable(observer("vegalite")).define("vegalite", ["require"], function(require){return(
require("vega-embed")
)});
  main.variable(observer("selection_profile")).define("selection_profile", ["_","fragments","summary_json"], function(_,fragments,summary_json)
{
  let summary = [];
  _.each (fragments, (d,i)=> {
    _.each (["HKU1","OC43","SARS","SARS-CoV-2"], (s)=> {
      let T = summary_json[d[0]].rates["T"][s];
      if (T > 0) {
        summary.push ({'segment' : i+1, 'x': d[1], 'omega' : summary_json[d[0]].rates["mean-omega"][s], 'T' : T, 's': s});
        summary.push ({'segment' : i+1, 'x': d[2], 'omega' : summary_json[d[0]].rates["mean-omega"][s], 'T' : T, 's': s});

      } else {
        summary.push ({'segment' : i+1, 'x': d[1], 'T' : T, 's': s});
        summary.push ({'segment' : i+1, 'x': d[2], 'T' : T, 's': s});

      }
    })});
  return summary;
}
);
  main.variable(observer("fragments")).define("fragments", ["_","summary_json"], function(_,summary_json)
{
  
  let result = _.sortBy(_.flatten (_.map (summary_json, (d,k)=> {
      let ranges   = _.filter (d.map, (i)=>i>=0);
      let my_range = [];
      ranges.push (1e100);
      let last_check = ranges[0];

      
      _.reduce (ranges, (accumulator, value)=> 
                {
                    if ((value - accumulator) % 3 == 0) {
                      return value;
                    } else {
                         let tag = k.split ("_");
                         if (tag.length > 3) {
                           tag = tag[1]+"/"+tag[2];
                         }  else {
                            tag = k.split (".")[0]; 
                         }
                         my_range.push ([k, 
                                         last_check, 
                                         accumulator + 2,
                                         d["busted"]["p"],
                                         0,
                                        tag,
                                        d["rates"]["mean-omega"]["Foreground"]
                                        ]);
                         last_check = value;
                         return value;
                    }
                },
                ranges[0]-3);
      
      return my_range;
     
    }
  ), true), (d)=>d[1]); 
  
  let index = {};
  let count = 0;
  _.each (result, (d) => {
       d.push (count++); 
  });
  
  return result;
}
);
  main.variable(observer("float_format")).define("float_format", ["d3"], function(d3){return(
d3.format (".3g")
)});
  main.variable(observer("cladeName")).define("cladeName", ["annotation_json","_"], function(annotation_json,_){return(
annotation_json ? _.find (_.keys(_.sample (annotation_json)["cdn"]), (d)=>d!="Reference") : "..."
)});
  main.variable(observer("plotPie")).define("plotPie", ["vegalite"], function(vegalite){return(
(data)=>vegalite ({
  "data": {
    "values": data
  },
  "encoding": {
    "theta": {"field": "proportion", "type": "quantitative", "stack": true},
    "color": {"field": "omega", "type": "quantitative", 
      //"sort": "descending",
      "title" : "dN/dS",
      "scale": {
        "domain" : [0,4],
        "type" : "sqrt",
        "clamp" : true,
        //"domainMid": 1,
        "scheme": "lightmulti"
      }
   }},
   "layer" : [
     {  "mark": {"type": "arc", "innerRadius": 40, "outerRadius" : 60, tooltip : true, padAngle : 0.0,
                strokeWidth : 1, strokeOpacity: 1},
         "encoding" : {
                  "stroke" : {value : "black"},
         }
      },
     {  
       "mark": {"type": "text", "outerRadius" : 70, "fontSize" : 18},
        "encoding": {
        "color" : {"value" : "black"},

        "text": {
          "field": "omega", "type": "nominal",
          "format" : ".2f",
          "condition": {"test": "datum['omega'] <= 1.", "value": ""},
        }
        }
     },
      {  
       "mark": {"type": "text", "outerRadius" : 20, "fontSize" : 18},
        "encoding": {
        "color" : {"value" : "black"},
        "text": {
          "field": "proportion", "type": "nominal",
          "format" : ".2p",
          "condition": {"test": "datum['omega'] <= 1.", "value": ""},
      }
        }
    }
    ],
  "view": {"stroke": null}
})
)});
  main.variable(observer("prime_annotation")).define("prime_annotation", ["_","summary_json"], function(_,summary_json){return(
_.map (summary_json[_.first (_.keys(summary_json))]["prime-properties"], (d)=>d.split (" ")[2])
)});
  main.variable(observer("report_ratio")).define("report_ratio", ["float_format"], function(float_format){return(
(a,b)=> {
  if (a == 0 && b == 0) return 'N.D.';
  if (a == 0) return 'Infinite';
  return  float_format (b/a);
}
)});
  main.variable(observer("species")).define("species", ["_","summary_json"], function(_,summary_json){return(
_.sortBy (_.filter (_.uniq (_.map (summary_json["S"]["tree_tags"], (d)=>d[0])), (d)=>d.length))
)});
  main.variable(observer("speciesCount")).define("speciesCount", ["_","summary_json"], function(_,summary_json){return(
_.map (summary_json, (seg,k)=>_.countBy (_.filter (seg["tree_tags"], (d)=>d[1] == false), (d)=>d[0]))
)});
  main.variable(observer("species_colors")).define("species_colors", ["d3","species"], function(d3,species){return(
d3.scaleOrdinal(d3.schemeCategory10).domain (species)
)});
  main.variable(observer("busted_distributions")).define("busted_distributions", ["_","summary_json"], function(_,summary_json){return(
_.flatten (_.map (summary_json, (d,k)=>{
    return _.map (d["rates"]["busted"]["Test"], (dd)=>{
        return {
            file: k,
            omega: dd.omega,
            proportion: dd.proportion,
            p: d["busted"]["p"]
        };
    });
}))
)});
  main.variable(observer("relax_distributions")).define("relax_distributions", ["_","summary_json"], function(_,summary_json){return(
_.flatten (_.map (summary_json, (d,k)=>{
    return _.flatten (_.map (d["rates"]["relax"], (dd2,kk)=>{
        
        return _.map (dd2, (dd)=>{return {
            file: k,
            species: kk,
            omega: dd.omega,
            proportion: dd.proportion,
            p: d["relax"]["p"]
        }
        });
    }))}))
)});
  main.variable(observer("busted_distribution_summary")).define("busted_distribution_summary", ["_","summary_json"], function(_,summary_json)
{
  let bds = _.sortBy (_.map (summary_json, (d,k)=>{
    let dd =  d["rates"]["busted"]["Test"];
        return {
            file: k,
            omega1: dd[0].omega,
            proportion1: dd[0].proportion,
            omega2: dd[1].omega,
            proportion2: dd[1].proportion,
            omega3: dd[2].omega,
            proportion3: dd[2].proportion,
            p: d["busted"]["p"],
        };
  }), (d)=>d.p); 
  return _.map (bds, (record, i)=> {
      record['q'] = record['p'] * bds.length / (i+1); 
      return record;
  });
}
);
  main.variable(observer("conserved_sites")).define("conserved_sites", ["_","annotation_json","species"], function(_,annotation_json,species){return(
_.filter (_.map (annotation_json, (v,k)=>[k,v]), (s)=>_.uniq (_.flatten (_.map (species, (sp)=>_.uniq (_.keys (s[1].aa ? s[1].aa[sp] : []))))).length == 1, (d)=>[+d[0]])
)});
  main.variable(observer("site2segment")).define("site2segment", ["_","summary_json","annotation_json"], function(_,summary_json,annotation_json)
{
  let r = {};
  _.each (summary_json, (d,s)=> {
      _.each (d.map, (c)=> {
          if (c >= 0 && (c in annotation_json)) {
            r[c] = s; 
          }
      });
  });
              
  return r;
}
);
  main.variable(observer("site2alignment")).define("site2alignment", ["_","annotation_json","site2segment","summary_json"], function(_,annotation_json,site2segment,summary_json)
{
  let r = {};
  let offset = 1;
  let last_segment = "";
  let only_sites = _.sortBy (_.map (annotation_json, (d,k)=>[k,d.index]), (s)=>+s.k);
  //return only_sites;
  _.each (only_sites, (d)=> {
      if (site2segment[d[0]] != last_segment) {
        if (last_segment && last_segment.length) {
          offset += summary_json [last_segment].map.length;
        }
        last_segment = site2segment[d[0]];
        
      }
      r [d[0]] = offset + d[1];
  });
              
  return r;
}
);
  main.variable(observer("p_cut")).define("p_cut", function(){return(
0.05
)});
  main.variable(observer("selected_sites")).define("selected_sites", ["_","annotation_json","prime_annotation","summary_json","segment_id"], function(_,annotation_json,prime_annotation,summary_json,segment_id)
{
  let s = _.map (_.filter (_.map (annotation_json, (v,k)=>[k,v]), (s)=>s[1].bMEME.p<=0.05), (d)=>{return {'coordinate' : +d[0],'p' : d[1].bMEME.p,'meme_branches' : d[1].bMEME["br"],'gene': d[1].G, 'site' : d[1].S, 'fel_p' : d[1].bFEL.p, 'fel_n' : d[1].bFEL.b < d[1].bFEL.a, 'prime' : _.map(_.filter (_.map (d[1].prime.p, (p,i)=>[i,p,i>0 ? d[1].prime['lambda'][i-1] : null]), (pr)=>pr[1]<0.05), (d)=>{if (d[0]>0) d[0] = prime_annotation [d[0]-1]; else d [0] = "Overall"; return d;})};});
  
  

  s = _.sortBy (s, (d)=>d.p);
  
  let tests = summary_json[segment_id].map.length;
  
  _.each (s, (d,i)=> {
      d.q = Math.min (1,d.p * (tests/(i+1)));
  });
  return _.sortBy (s, (d)=>d.site);
 }
);
  main.variable(observer("selected_sites_leaves")).define("selected_sites_leaves", ["_","annotation_json","prime_annotation","summary_json","segment_id"], function(_,annotation_json,prime_annotation,summary_json,segment_id)
{
  let s = _.map (_.filter (_.map (annotation_json, (v,k)=>[k,v]), (s)=>("lMEME" in s[1]) && s[1].lMEME.p<=0.05), (d)=>{return {'coordinate' : +d[0],'p' : d[1].lMEME.p,'meme_branches' : d[1].lMEME["br"],'gene': d[1].G, 'site' : d[1].S, 'pMEME' : d[1].bMEME.p, 'fel_p' : d[1].bFEL.p, 'fel_n' : d[1].bFEL.b < d[1].bFEL.a, 'prime' : _.map(_.filter (_.map (d[1].prime.p, (p,i)=>[i,p,i>0 ? d[1].prime['lambda'][i-1] : null]), (pr)=>pr[1]<0.05), (d)=>{if (d[0]>0) d[0] = prime_annotation [d[0]-1]; else d [0] = "Overall"; return d;})};});
  s = _.sortBy (s, (d)=>d.p);
  let tests = summary_json[segment_id].map.length;
  _.each (s, (d,i)=> {
      d.q = Math.min (1,d.p * (tests/(i+1)));
  });
  return _.sortBy (s, (d)=>d.site);
 }
);
  main.variable(observer("negative_sites")).define("negative_sites", ["_","annotation_json","summary_json","segment_id"], function(_,annotation_json,summary_json,segment_id)
{
  let s = _.map (_.filter (_.map (annotation_json, (v,k)=>[k,v]), (s)=>s[1].bFEL.p<=0.05 && s[1].bFEL.a > s[1].bFEL.b), (d)=>{return {'coordinate' : +d[0],'p' : d[1].bFEL.p,'meme_weight' : d[1].bMEME["w+"],'gene': d[1].G, 'site' : d[1].S, 'alpha' : d[1].bFEL.a,'beta': 
                                                                                                       d[1].bFEL.b};});
  s = _.sortBy (s, (d)=>d.p);
  let tests = summary_json[segment_id].map.length;
  _.each (s, (d,i)=> {
      d.q = Math.min (1,d.p * (tests/(i+1)));
  });
  return _.sortBy (s, (d)=>d.site);
 }
);
  main.variable(observer("diff_sites")).define("diff_sites", ["_","annotation_json","report_ratio"], function(_,annotation_json,report_ratio){return(
_.map (_.filter (_.map (annotation_json, (v,k)=>[k,v]), (s)=> Math.abs(s[1].bCFEL.pp)<=0.1), (d)=>[+d[0], d[1].bCFEL.a, d[1].bCFEL.b.background, d[1].bCFEL.b.Foreground, d[1].bCFEL.p.overall, d[1].S, d[1].G, report_ratio (d[1].bCFEL.b.background,d[1].bCFEL.b.Foreground),d[1].bCFEL.q])
)});
  main.variable(observer("directional_sites")).define("directional_sites", ["_","annotation_json","site2alignment"], function(_,annotation_json,site2alignment){return(
_.map (_.map (_.filter (_.map (annotation_json, (v,k)=>[k,v]), (s)=> _.some (s[1].fade, (dd)=>dd.BF >= 100)), (d)=>[+d[0], d[1].fade, site2alignment[d[0]]]), (d)=>[d[0], _.map (_.filter (_.toPairs (d[1]), (r)=>r[1].BF >= 100), (d)=>d[0]).join (""), d[2], annotation_json[d[0]].G, annotation_json[d[0]].S])
)});
  main.variable(observer("cfel_sites")).define("cfel_sites", ["_","annotation_json"], function(_,annotation_json)
{
  let result = [];
  _.each (_.chain (annotation_json).map ((d,k)=>[k,d]).filter ((d)=>d[1].bCFEL.pp > 0 && d[1].bCFEL.pp <= 0.05).value (), ((d)=> { _.each (d[1].bCFEL.p,(v,p)=>{
    if (v <= 0.05) {
      result.push ({'site' : d[0], 'type' : p, 'p' : v});
    }
  })}));
  return result;
}
);
  main.variable(observer("site_report")).define("site_report", ["annotation_json","site2view"], function(annotation_json,site2view){return(
annotation_json [site2view]
)});
  main.variable(observer("freq_report")).define("freq_report", ["_"], function(_){return(
(freqs)=> {
    return _.map (_.sortBy (_.map (freqs, (f,a)=>[a,f]), (d)=>-d[1]), (d)=> d[0] + "<sub>" + d[1] + "</sub>").join (" ");
}
)});
  main.variable(observer("cfel_site_report")).define("cfel_site_report", ["annotation_json","cladeName","float_format","_","species","report_ratio"], function(annotation_json,cladeName,float_format,_,species,report_ratio){return(
(d)=> {
  const site_data = annotation_json[d]["bCFEL"];
  const spc = {
      'Reference' : 'background',
  };
  spc[cladeName] = 'Foreground';
  
  return "<b>p-value = " + float_format(site_data.p.overall) + "</b></p><table style = 'margin-left: 2em'><tr><th>Branch group</th><th>&omega;</th></tr>" + _.map (species, (sp)=>"<tr><td>" + sp + "</td><td>" + report_ratio (site_data.a, site_data.b[spc[sp]]) + "</td></tr>"). join ("") + "</table>";
}
)});
  main.variable(observer("fade_site_report")).define("fade_site_report", ["_","annotation_json","float_format"], function(_,annotation_json,float_format){return(
(d)=> {
  const site_data = _.filter (_.toPairs (annotation_json[d]["fade"]), (d)=>d[1].BF >= 100);
  if (site_data.length) {
    return "<table style = 'margin-left: 2em'><tr><th>Target residue</th><th>Bias</th><th>Bayes Factor</th></tr>" + _.map (site_data, (sp)=>"<tr><td>" + sp[0] + "</td><td>" +float_format (sp[1].rate) + "</td><td>" +float_format (sp[1].BF) + "</td></tr>"). join ("") + "</table>";
  }
  return " No evidence of directional selection";
  
}
)});
  main.variable(observer("prime_site_report")).define("prime_site_report", ["_","annotation_json","summary_json","segment_id","float_format"], function(_,annotation_json,summary_json,segment_id,float_format){return(
(d)=> {
  const site_data = _.filter (annotation_json[d]["prime"]["p"], (d)=>d <= 0.05);
  if (site_data.length) {
    return "<table style = 'margin-left: 2em'><tr><th>Property</th><th>&lambda;</th><th>p-value importance</th></tr>\n" + _.map (annotation_json[d]["prime"]["lambda"], (sp,i)=>"<tr><td>" + summary_json[segment_id]["prime-properties"][i] + "</td><td>" +float_format (sp) + "</td><td>" +float_format (annotation_json[d]["prime"]["p"][i]) + "</td></tr>"). join ("\n") + "</table><br/><span style = 'margin-left: 2em'> Omnibus importance test p = " + float_format (annotation_json[d]["prime"]["p"][5]) + "</span>";
  }
  return "No evidence of property importance selection";
  
}
)});
  main.variable(observer("coevolve_sites")).define("coevolve_sites", ["_","summary_json","annotation_json"], function(_,summary_json,annotation_json){return(
_.flatten (_.map (_.map (summary_json, (sd,si)=> [si,_.filter (sd["bgm"], (d)=>d[4]>=0.5)]), (sd)=> {
    return _.map (sd[1], (d)=> {
      let dd = _.clone (d);
      let s1 = summary_json[sd[0]].map[d[0]-1];
      let s2 = summary_json[sd[0]].map[d[1]-1];
      dd.push (s1); dd.push (s2);
      dd.push (annotation_json[s1].G);
      dd.push (annotation_json[s1].S);
      dd.push (annotation_json[s2].S);
      return dd;
    })
}))
)});
  main.variable(observer("subsByBranch")).define("subsByBranch", ["_","summary_json","segment_id","annotation_json"], function(_,summary_json,segment_id,annotation_json)
{
  let byBranch = {};
  _.each (summary_json[segment_id].subs, (d,k)=> {
      _.each (d, (state, branch)=> {
          if (state != "---") {
            if ((branch in byBranch) == false) {
              byBranch [branch] = [];
            }
            byBranch [branch].push (annotation_json[k].G + "/" + annotation_json[k].S);
          }
      });
  });
  return byBranch;
}
);
  main.variable(observer("polymorphic_sites")).define("polymorphic_sites", ["_","annotation_json","cladeName"], function(_,annotation_json,cladeName){return(
_.chain (annotation_json).toPairs ().map ((d)=>[d[0], _.filter (d[1].aa ? _.toPairs(d[1].aa[cladeName]) : [], (r)=> r[0] != '-')]).filter ((d)=>d[1].length > 1).value()
)});
  main.variable(observer("entropy")).define("entropy", ["_","d3"], function(_,d3){return(
(array)=> {
   const nonGap = _.filter (_.toPairs (array), (d)=>d[0] != '-');
   let N = d3.sum (nonGap, (d)=>d[1]);
   const log2 = Math.log (2);
   return -d3.sum (_.map (nonGap, (d)=>d[1]/N * Math.log (d[1]/N) / log2));
}
)});
  main.variable(observer("gene_coordinates")).define("gene_coordinates", ["_"], function(_){return(
_.map ([
  //[266,'ORF1a',13483],
  //[13471, 'ORF1b',21555],
  [21563,'S',25385],
  /*[25393,'ORF3a',26220],
  [26245,'E',26472],
  [26523,'M',27191],
  [27202,'ORF6',27387],
  [27394,'ORF7a',27759],
  [27756,'ORF7b',27887],
  [27894,'ORF8',28259],
  [28274,'N',29533],
  [29558,'ORF10',29674]*/
], (d,i)=>{
  d.push (i);
  return d;
})
)});
  main.variable(observer("name_fragment")).define("name_fragment", function(){return(
(n)=>{ 
    let pieces = n.split ('_');
    if (pieces.length > 3) {
        return pieces[1]+"/"+pieces[2];
    }
    return pieces[1];
}
)});
  main.variable(observer("summary_json")).define("summary_json", ["analysis_info"], function(analysis_info){return(
analysis_info.s
)});
  main.variable(observer("has_full_meme")).define("has_full_meme", ["_","annotation_json"], function(_,annotation_json){return(
_.some (annotation_json, (d)=>"lMEME" in d)
)});
  main.variable(observer("annotation_json")).define("annotation_json", ["analysis_info"], function(analysis_info){return(
analysis_info.a
)});
  const child3 = runtime.module(define3);
  main.import("legend", child3);
  main.import("swatches", child3);
  const child4 = runtime.module(define4);
  main.import("translation_table", child4);
  const child5 = runtime.module(define5);
  main.import("a", child5);
  main.import("r", child5);
  main.variable(observer("React")).define("React", ["r"], function(r){return(
r('react')
)});
  main.variable(observer("ReactDOM")).define("ReactDOM", ["r"], function(r){return(
r('react-dom')
)});
  main.variable(observer("translation_table_gap")).define("translation_table_gap", ["translation_table"], function(translation_table)
{
  let tt = translation_table;
  tt['---'] = '-';
  tt['NNN'] = '-';
  return tt;
}
);
  main.variable(observer("translate_ambiguous_codon_gap")).define("translate_ambiguous_codon_gap", ["translation_table_gap"], function(translation_table_gap){return(
(c)=> {
  if (c in translation_table_gap) {
    return translation_table_gap[c];
    
 [c]; }
  
  return '-';
}
)});
  main.variable(observer()).define(["d3","analysis_info","analysis_name","segment_id","_","translate_ambiguous_codon_gap","ReactDOM","React","a"], async function(d3,analysis_info,analysis_name,segment_id,_,translate_ambiguous_codon_gap,ReactDOM,React,a)
{
  let fasta = await d3.text(analysis_info.b + analysis_name + "/" + segment_id + ".combined.fas");
  //console.log(fasta);
  fasta = _.map (fasta.split ('\n'), (l)=>{
      if (l[0]=='>') {
        let p = l.substr (1).split ('/');
        if (p.length > 3) {
          let s = p[p.length-1].split('|');
          return '>' + p[3] + "|" + s[s.length-1]; 
        } else {
          p = l.substr (1).split ('_');
          //p = p.splice (3);
          //p.splice (-2,2);
          //return '>REF|' + p.join("/");
          return '>REF|' + p[1];
        }
        return l;
      }
      //accumulator += l.replace (" ", "");
      if (l.length) {
        return _.map (_.range (0,l.length,3), (s)=>translate_ambiguous_codon_gap (l.substr (s,3))).join ("");
      }
      return "";


  }).join ("\n");
  ReactDOM.render(
    React.createElement(
      a.default,
      {fasta: a.fastaParser(fasta),
       site_color:a.colors.amino_acid_color,
       text_color:a.colors. amino_acid_text_color,
       centerOnSite: 50
      },
      null
    ),
    document.getElementById('alignment'));
}
);
  main.variable(observer()).define(["html"], function(html){return(
html`
<link type="text/css" href="https://stephenshank.com/alignment.css" rel="stylesheet">
`
)});
  return main;
}
