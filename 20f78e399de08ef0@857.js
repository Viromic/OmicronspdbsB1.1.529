// https://observablehq.com/@spond/usual-vs-unusual-mutation-analyses@857
import define1 from "./715b4c45cc45c3b3@223.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Usual vs unusual mutation analyses`
)});
  main.variable(observer()).define(["md","render_math"], function(md,render_math){return(
md`## Brief model description

We propose a very simple **generative** model for fitting the __observed__ distribution of count data, stratified into usual and unusual mutations and inferring rate parameters.

The model is given a set of K **usual** and N **unusual** mutation records, _u<sub>i</sub>, i = 1..K, n<sub>i</sub>, i = 1..N_, where _m<sub>i</sub> = [count<sub>i</sub>, coverage<sub>i</sub>]_. Count data are modelled as draws from a mixture of a Poission distribution (the error component) and a Negative Binomial distribution (the biological component). It is expected (but not enforced explicitly) that mutations from the error component occur at lower average frequencies than the mutations from the biological component.

${render_math ("u_i \\sim \\mathbf{p_u} \\text\{Poisson\} (\\mathbf{\\lambda} \\times coverage_i) + (1-\\mathbf{p_u}) \\text\{NB\} (\\mathbf{r_u} \\times coverage_i, 0.5)")}.

<p>

${render_math ("n_i \\sim \\mathbf{p_n} \\text\{Poisson\} (\\mathbf{\\lambda} \\times coverage_i) + (1-\\mathbf{p_n}) \\text\{NB\} (\\mathbf{r_n} \\times coverage_i, 0.5)")}.

<p>

The model parameters are as follows

|Parameter|Description|
|:---|:---|
|${render_math ("\\lambda")}| The mean error rate [shared by usual and unusual mutations] |
|${render_math ("\\mathbf{r_u}")}| The mean rate of non-error usual biological mutations |
|${render_math ("\\mathbf{r_n}")}| The mean rate of non-error unusual biological mutations |
|${render_math ("\\mathbf{p_u}")}| The proportion of usual mutations that are errors |
|${render_math ("\\mathbf{p_n}")}| The proportion of unusual mutations that are errors |

<p>

The five model parameters are estimated by maximum likelihood (direct optimization of the likelihood function). Given model paremeter estimates, each mutation is classified as error vs non-error using the empirical Bayes procedure. For example, 

${render_math ("\\text{P} (u_i \\text{ is error } | \\text \{data\}) = \\frac{\\mathbf{p_u} \\text\{Poisson\} (count_i; \\mathbf{\\lambda} \\times coverage_i)}{\\mathbf{p_u} \\text\{Poisson\} (count_i;\\mathbf{\\lambda} \\times coverage_i) + (1-\\mathbf{p_u}) \\text\{NB\} (count_i;\\mathbf{r_u} \\times coverage_i, 0.5)}")}.




`
)});
  main.variable(observer()).define(["md","usual_aa","unusual_aa","d3","rate_estimates","rate_estimates0"], function(md,usual_aa,unusual_aa,d3,rate_estimates,rate_estimates0){return(
md`## Rate estimate reports

The dataset encodes ${usual_aa.length} **usual** and ${unusual_aa.length} **unusual** mutations with coverage of at least **100**. Mixed generative model for these data estimates the following rates and yields the AIC score of **${d3.format ("2g")(2*rate_estimates["fx"] + 10)}**

| Parameter | Estimate |
|: -----   :|: -----  :|
| Baseline error rate | ${d3.format (".2p")(rate_estimates["x"][4])}|
| Usual mutation rate | ${d3.format (".2p")(rate_estimates["x"][0])}|
| Fraction of usual mutations that are errors | ${d3.format (".2p")(rate_estimates["x"][1])}|
| Unusual mutation rate | ${d3.format (".2p")(rate_estimates["x"][2])}|
| Fraction of unusual mutations that are errors | ${d3.format (".2p")(rate_estimates["x"][3])}|

<p>

As a comparison, the model which allocates usual and unusual mutations to separate Poission rate distributions yields the AIC score of **${d3.format ("2g")(2*rate_estimates0["fx"] + 4)}**, and infers the rates of ${d3.format (".2p")(rate_estimates0["x"][0])} for **usual** mutations, and ${d3.format (".2p")(rate_estimates0["x"][1])} for **unusual** mutations. 

### Mutation lists

The list of mutations which have been inferred to **not** be from the error component of the distribution, i.e. putatively **real** (≥99.9% posterior empirical Bayes probability) are in the following table.



`
)});
  main.variable(observer()).define(["table","_","site_info","d3","real_format"], function(table,_,site_info,d3,real_format){return(
table(_.map (site_info, (record) => {
  var r = {"Gene" : record[0]['gene'], "Position": record[0]['position'], "AA" : record[0]['aa'], "Count" : record[0]['count'], "Coverage" : record[0]['coverage'], "Frequency" : d3.format (".2p")(record[0]['count'] / record[0]['coverage']), "Type" : record[0]['unusual'] ? "Unusual" : "Usual", "Real" : real_format(record[1][1])};
  
  //console.log (r);
  
  return r;
}).sort ((a,b) => {return (+a["Position"])-(+b["Position"]);}), {limit: 1024,columns: [
    'Gene',
    'Position',
    'AA',
    'Count',
    'Frequency',
    'Coverage', 
    'Type',
   { 
      key: 'Real',
      name: 'Prob is real',
      render: val => {if (val > 0.9999) return `<b>${val}</b>`; return `${val}`;}
    }
  /*
    { 
      key: 'p-value',
      name: 'LRT p-value',
      render: val => {if (val < 0.05) return `<b>${val}</b>`; return `${val}`;}
    },
    { 
      key: 'EF',
      name: `K<sub>"EF"</sub>`,
      render: val => {if (val > 1) return `<font color = 'red'>${val}</font>`; return `<font color = 'green'>${val}</font>`;}
    },

    { 
      key: 'K',
      name: `K<sub>"K"</sub>`,
      render: val => {if (val > 1) return `<font color = 'red'>${val}</font>`; return `<font color = 'green'>${val}</font>`;}
    },
    { 
        key: 'H',
        name: `K<sub>"H"</sub>`,
        render: val => {if (val > 1) return `<font color = 'red'>${val}</font>`; return `<font color = 'green'>${val}</font>`;}
    }*/
]})
)});
  main.variable(observer()).define(["compare_histograms","_","counts_by_type"], function(compare_histograms,_,counts_by_type){return(
compare_histograms (_.filter (_.map (counts_by_type['usual'], (m) => m[0]), x=>x < 0.95), _.map (counts_by_type['unusual'], (m) => m[0]), "usual", "unusual", "log10(fraction)")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`----`
)});
  main.variable(observer("aa_mutation_data")).define("aa_mutation_data", ["d3","_","translation_table","annotation_table","min_coverage"], async function(d3,_,translation_table,annotation_table,min_coverage)
{
  //var raw_data = generate_fake_data (10000, 0.005, 1);
  var raw_data = await d3.text ('https://dl.dropbox.com/s/lm381hg5q4kem77/DRR030146.codfish');
  
  var parsed_data = d3.tsvParseRows (raw_data, (r, i) => {return {
    "gene" : r[0],
    "position" : +r[1],
    "coverage" : +r[2],
    "codon" : r[3],
    "count" : +r[4]
  }});
   
  
  
  parsed_data = _.map (parsed_data, (v) => {
     var is_unusual = true;
     var aa = undefined;
     if (v["codon"] in translation_table) {
        aa = translation_table[v["codon"]];
        
        if (aa in annotation_table[v.gene][v.position]){
            is_unusual = annotation_table[v.gene][v.position][aa].isUnusual || annotation_table[v.gene][v.position][aa].isAPOBEC;
        }
     }
       
     return _.extend (v, {'aa' : aa, 'unusual' : is_unusual});
  });
  
  var aa_mutations = [];
  var indexer = {};
  
  _.each (parsed_data, (v) => {
      var index = -1;
      if (v.gene in indexer) {
        if (v.position in indexer[v.gene]) {
            if (v.aa in indexer[v.gene][v.position]) {
              index =  indexer[v.gene][v.position][v.aa];
            } else {
              indexer[v.gene][v.position][v.aa] = aa_mutations.length;
            }
        } 
        else {
           indexer[v.gene][v.position] = {};
           indexer[v.gene][v.position][v.aa] = aa_mutations.length;
        }
      } else {
          indexer[v.gene] = {};
          indexer[v.gene][v.position] = {};
          indexer[v.gene][v.position][v.aa] = aa_mutations.length;

      } 
    
      if (index >= 0) {
          aa_mutations[index].count += v.count;
      } else {
          aa_mutations.push (v); 
      }
  }); 
  
  return aa_mutations.filter (r => r.coverage >= min_coverage);
}
);
  main.variable(observer("counts_by_type")).define("counts_by_type", ["_","aa_mutation_data"], function(_,aa_mutation_data)
{
    var res = {'usual' : [], 'unusual' : []};
  
    _.each (aa_mutation_data, (r) => {
        var counts = [r.count / r.coverage, r.count, r.coverage];
        res [r.unusual ? 'unusual' : 'usual'].push (counts);
    });
  
    return res;
}
);
  main.variable(observer("usual_aa")).define("usual_aa", ["_","aa_mutation_data"], function(_,aa_mutation_data){return(
_.filter (aa_mutation_data, r=>r.unusual == false)
)});
  main.variable(observer("unusual_aa")).define("unusual_aa", ["_","aa_mutation_data"], function(_,aa_mutation_data){return(
_.filter (aa_mutation_data, r=>r.unusual)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---`
)});
  main.variable(observer("annotation_table")).define("annotation_table", ["d3","_"], async function(d3,_)
{
  var raw_data = await d3.json ('https://dl.dropbox.com/s/dru1vl8izrjoz2q/aminoAcidPcnts.json');
  var result = {};
  
  _.each (raw_data, (v,k) => {
      if (!(v['gene'] in result)) {
          result[v['gene']] = {};
      }
      var p = +v.position;
      if (!(p in result[v['gene']])) {
         result[v['gene']][p] = {};
      }
      result[v['gene']][p][v.aa] = v;
  });
  return result;
}
);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require ("d3")
)});
  main.variable(observer("translation_table")).define("translation_table", ["d3","_"], function(d3,_)
{
  var code = d3.csvParse ("Codon,AA\nTTT,F\nTCT,S\nTAT,Y\nTGT,C\nTTC,F\nTCC,S\nTAC,Y\nTGC,C\nTTA,L\nTCA,S\nTAA,*\nTGA,*\nTTG,L\nTCG,S\nTAG,*\nTGG,W\nCTT,L\nCCT,P\nCAT,H\nCGT,R\nCTC,L\nCCC,P\nCAC,H\nCGC,R\nCTA,L\nCCA,P\nCAA,Q\nCGA,R\nCTG,L\nCCG,P\nCAG,Q\nCGG,R\nATT,I\nACT,T\nAAT,N\nAGT,S\nATC,I\nACC,T\nAAC,N\nAGC,S\nATA,I\nACA,T\nAAA,K\nAGA,R\nATG,M\nACG,T\nAAG,K\nAGG,R\nGTT,V\nGCT,A\nGAT,D\nGGT,G\nGTC,V\nGCC,A\nGAC,D\nGGC,G\nGTA,V\nGCA,A\nGAA,E\nGGA,G\nGTG,V\nGCG,A\nGAG,E\nGGG,G\n");
  var mapped_code = {};
  _.each (code, (v,k) => {mapped_code[v.Codon] = v.AA;});
  mapped_code["---"] = "-";
  mapped_code["NNN"] = "?";
  return mapped_code;
}
);
  main.variable(observer()).define(["translation_table"], function(translation_table){return(
JSON.stringify (translation_table)
)});
  main.variable(observer("ambiguous_codes")).define("ambiguous_codes", function()
{
    return {
      'A' : ['A'],
      'C' : ['C'],
      'G' : ['G'],
      'T' : ['T'],
      'U' : ['T'],
      'R' : ['A','G'],
      'Y' : ['C','T'],
      'K' : ['G','T'],
      'M' : ['A','C'],
      'S' : ['C','G'],
      'W' : ['A','T'],
      'B' : ['C','G','T'],
      'D' : ['A','G','T'],
      'H' : ['A','C','T'],
      'V' : ['A','C','T'],
      'N' : ['A','C','G','T'],
      '?' : ['A','C','G','T']
    };
}
);
  main.variable(observer("translate_ambiguous_codon")).define("translate_ambiguous_codon", ["translation_table","_","ambiguous_codes"], function(translation_table,_,ambiguous_codes){return(
(codon)=>{
    if (codon in translation_table) {
      return  translation_table[codon];
    }
  
    let options = {};
    _.each (ambiguous_codes[codon[0]], (n1)=> {
         _.each (ambiguous_codes[codon[1]], (n2)=> {
            _.each (ambiguous_codes[codon[2]], (n3)=> {
                let c = translation_table[n1+n2+n3];
                if (c in options) {
                  options[c] += 1; 
                } else {
                  options [c] = 1; 
                }
            });
          });
    });
  
    options = _.keys(options);
    if (options.length == 0) {
      return "?"; 
    }
    return _.sortBy (options).join ("");
}
)});
  main.variable(observer("_")).define("_", ["require"], function(require){return(
require('lodash')
)});
  main.variable(observer("plotly")).define("plotly", ["require"], function(require){return(
require("https://cdn.plot.ly/plotly-latest.min.js")
)});
  main.variable(observer("compare_histograms")).define("compare_histograms", ["_","rate_estimates","DOM","plotly"], function(_,rate_estimates,DOM,plotly){return(
(x1, x2, tag1, tag2, axis_label) => {
 
  var trace1 = {
    x: _.map (x1, (x) => Math.log10(x)),
    type: "histogram",
    opacity: 0.5,
    name : tag1,
    /*xbins: {
        size : 0.01
      },*/
    marker: {
       color: '#1f77b4',
    },
  };
  var trace2 = {
    x: _.map (x2, (x) => Math.log10(x)),
    type: "histogram",
    opacity: 0.6,
    name : tag2,
    /*xbins: {
        size : 0.01
      },*/
    marker: {
       color: '#ff7f0e',
    },
  };
  
  var lower_bound = -5,
      upper_bound = Math.log10 (0.5),
      bins = 100,
      step = (upper_bound-lower_bound) / bins;
  
  var counts_usual = new Array (bins),
      counts_unusual = new Array (bins);
  
  for (var i = 0; i < bins; i++) {
      counts_usual[i] = 0;
      counts_unusual[i] = 0;
  }
  _.each (trace1.x, (x) => {counts_usual[Math.floor ((x-lower_bound)/step)]++});
  _.each (trace2.x, (x) => {counts_unusual[Math.floor ((x-lower_bound)/step)]++});

    for (var i = bins-2; i >= 0; i--) {
      counts_usual[i] += counts_usual[i+1];
      counts_unusual[i] += counts_unusual[i+1];
  }


  var ratios = _.map (counts_usual, (x,i) => {if (counts_unusual[i] > 0) {return x / counts_unusual[i];} return x / (0.5+counts_unusual[i])});
  
  
  
  
  var trace3 = {
    x:_.range (lower_bound, upper_bound, step),
    y:ratios,
    mode: 'lines',
    opacity : 1.0,
    name : "Usual/Unusual ratio",
    yaxis: 'y2',
    marker: {
       color: 'rgb(80,80,80)',
    },
  };


  var data = [trace1, trace2,trace3];
  var layout = {
      barmode: "overlay", 
      width : 1024,
      height : 600,
      annotations: [
      {
        x: Math.log10 (rate_estimates["x"][4]),
        y: 1,
        xref: 'x',
        yref: 'paper',
        text: 'Error rate',
        showarrow: true,
        arrowhead: 1,
        ax: 0,
        ay: -40
      },
      {
        x: Math.log10 (rate_estimates["x"][0]),
        y: 1,
        xref: 'x',
        yref: 'paper',
        text: 'Usual mutation rate',
        showarrow: true,
        arrowhead: 1,
        ax: 0,
        ay: -20
      },
      {
        x: Math.log10 (rate_estimates["x"][2]),
        y: 1,
        xref: 'x',
        yref: 'paper',
        text: 'Unusual mutation rate',
        showarrow: true,
        arrowhead: 1,
        ax: 0,
        ay: -40
      }
    ],
      shapes: [
        // 1st highlight during Feb 4 - Feb 6
        {
            type: 'rect',
            xref: 'x',
            yref: 'paper',
            x0: Math.log10 (rate_estimates["x"][4]),
            y0: 0,
            x1: Math.log10 (rate_estimates["x"][4]),
            y1: 1,
            fillcolor: '#d3d3d3',
            opacity: 0.5,
            line: {
                width: 2
            }
        },
        {
            type: 'rect',
            xref: 'x',
            yref: 'paper',
            x0: Math.log10 (rate_estimates["x"][0]),
            y0: 0,
            x1: Math.log10 (rate_estimates["x"][0]),
            y1: 1,
            fillcolor: '#d3d3d3',
            opacity: 0.5,
            line: {
                width: 2
            }
        },
        {
            type: 'rect',
            xref: 'x',
            yref: 'paper',
            x0: Math.log10 (rate_estimates["x"][2]),
            y0: 0,
            x1: Math.log10 (rate_estimates["x"][2]),
            y1: 1,
            fillcolor: '#d3d3d3',
            opacity: 0.5,
            line: {
                width: 2
            }
        }  
      ],       
      legend: {
        x: 0.8,
        y: 0.9
      },
     yaxis: {title: 'Count'},
      yaxis2: {
        showgrid: false,
        zeroline: false,
      title: 'Ratio',
      titlefont: {color: 'rgb(80,80,80)'},
      tickfont: {color: 'rgb(80,80,80)'},
      overlaying: 'y',
      side: 'right'
    },
      xaxis : {title : axis_label,
                      range : [-5, Math.log10 (0.5)],


              titlefont: {
       size : 14,
      
    }}
  };
  const div = DOM.element('div');
  plotly.newPlot(div, data, layout);
  return div;
}
)});
  main.variable(observer("log_poisson")).define("log_poisson", ["log_factorial"], function(log_factorial){return(
(count, rate) => {
   return count*Math.log (rate) - rate - log_factorial (count);
}
)});
  main.variable(observer("log_nb")).define("log_nb", ["log_gamma","log_factorial"], function(log_gamma,log_factorial){return(
(count, r, p) => {
    return log_gamma (r+count) - log_factorial (count) - log_gamma (r) + Math.log (p) * count + Math.log (1-p)*r;
}
)});
  main.variable(observer("log_factorial")).define("log_factorial", function()
{
  let cache = {0 : 0, 1 : 0, 2 : Math.log (2)};
  
  return (x) => {
    x = Math.floor (x);
    if (x >= 0) {
      if (x in cache) {
          return cache [x]; 
      }
      var accumulator = 0;
      var y = x;
      while (!(y in cache)) {
          cache[y] = Math.log (y);
          y--;
      }
      y++;
      while (y <= x) {
          cache[y] += cache[y-1];
          y++;
      }
      return cache [x];
    }
    return NaN;
  }
}
);
  main.variable(observer("log_gamma")).define("log_gamma", function(){return(
(x) => {
    if (x <= 0.) {
        return NaN;
    }
    
    const lngammaCoeff = [
        76.18009172947146,
        -86.50532032941677,
        24.01409824083091,
        -1.231739572450155,
        0.1208650973866179e-2,
        -0.5395239384953e-5
    ];
  
    const lookUpTable = [   0.       ,  0.       ,  0.6931472,  1.7917595,  3.1780538,
      4.7874917,  6.5792512,  8.5251614, 10.6046029, 12.8018275,
      15.1044126, 17.5023078, 19.9872145, 22.5521639, 25.1912212,
      27.8992714, 30.6718601, 33.5050735, 36.3954452, 39.3398842
    ];
  
    if (x <= 20. && Math.floor (x) == x) {
      return lookUpTable [x-1];
    }

    
    var  x0, y, tmp, ser;
    
    y = x0 = x;
    tmp = x0 + 5.5;
    tmp -= (x0+0.5) * Math.log(tmp);
  
    ser = 1.000000000190015 +
          lngammaCoeff[0] / (y + 1.) +
          lngammaCoeff[1] / (y + 2.) +
          lngammaCoeff[2] / (y + 3.) +
          lngammaCoeff[3] / (y + 4.) +
          lngammaCoeff[4] / (y + 5.) +
          lngammaCoeff[5] / (y + 6.);
    
    return -tmp + Math.log (2.506628274631005*ser/x0);
}
)});
  main.variable(observer("log_likelihood_mutation")).define("log_likelihood_mutation", ["log_poisson","log_nb"], function(log_poisson,log_nb){return(
(count, coverage, r, p, r0, proportion_error) => {
  
  
   if (coverage < 2*count) {
      return 0;
      count = coverage - count;
   }
    
   if (r < 0 || p < 0 || p > 1 || r0 < 0 || proportion_error < 0 || proportion_error > 1 || r0 > r) {
      return -1e100; 
   }
  
   var log_error = log_poisson (count, r0*coverage);
   var log_real  = log_nb (count, r*coverage, p);
   let best        = Math.max (log_error, log_real);
  
   return Math.log (proportion_error * Math.exp (log_error - best) + (1-proportion_error) * Math.exp (log_real - best)) + best;
   
}
)});
  main.variable(observer("log_likelihood_mutation_null")).define("log_likelihood_mutation_null", ["log_poisson"], function(log_poisson){return(
(count, coverage, r0) => {
  
  
   if (coverage < 2*count) {
      count = coverage - count;
      return 0;
   }
   return log_poisson (count, r0*coverage);   
}
)});
  main.variable(observer("log_likelihood_data")).define("log_likelihood_data", ["_","log_likelihood_mutation"], function(_,log_likelihood_mutation){return(
(usual, unusual, X) => {
    let [usual_rate, usual_mixing, unusual_rate, unusual_mixing, error_rate, usual_nb, unusual_nb] = X;
    if (error_rate == usual_rate || error_rate == unusual_rate) {
      return 1e100; 
    }
    //usual_nb = 0.1;
    //unusual_nb = 0.1;
    return -(_.sum(_.map (usual, (m)=>{return log_likelihood_mutation (m["count"], m["coverage"], (1-usual_nb)/usual_nb*usual_rate, usual_nb, error_rate, usual_mixing);})) + _.sum(_.map (unusual, (m)=>{return log_likelihood_mutation (m["count"], m["coverage"], (1-unusual_nb)/unusual_nb*unusual_rate, unusual_nb, error_rate, unusual_mixing);})));
}
)});
  main.variable(observer("log_likelihood_data_null")).define("log_likelihood_data_null", ["_","log_likelihood_mutation_null"], function(_,log_likelihood_mutation_null){return(
(usual, unusual, X) => {
    let [error_rate_usual, error_rate_unusual] = X;

    return -(_.sum(_.map (usual, (m)=>{return log_likelihood_mutation_null (m["count"], m["coverage"], error_rate_usual);})) + _.sum(_.map (unusual, (m)=>{return log_likelihood_mutation_null (m["count"], m["coverage"], error_rate_unusual);})));
}
)});
  main.variable(observer("pp")).define("pp", ["_","log_likelihood_data","usual_aa","unusual_aa"], function(_,log_likelihood_data,usual_aa,unusual_aa){return(
_.partial (log_likelihood_data, usual_aa, unusual_aa)
)});
  main.variable(observer("pp0")).define("pp0", ["_","log_likelihood_data_null","usual_aa","unusual_aa"], function(_,log_likelihood_data_null,usual_aa,unusual_aa){return(
_.partial (log_likelihood_data_null, usual_aa, unusual_aa)
)});
  main.variable(observer("fmin")).define("fmin", ["require"], function(require){return(
require ("fmin")
)});
  main.variable(observer("rate_estimates")).define("rate_estimates", ["_","pp","fmin"], function(_,pp,fmin)
{
  
  //usual_rate, usual_mixing, unusual_rate, unusual_mixing, error_rate

  //const N = [8,8,5,3,3,4,4];
  const N = [10,4,10,4,4];
  var best_score = 1e100, best_values = null;
  
  _.each (_.range (0.0001,0.01,(0.01-0.0001)/(N[4])), (error_rate) =>  {
      _.each (_.range (error_rate, 0.02, (0.02-error_rate)/(N[0])), (usual_rate) => {
          _.each (_.range (error_rate, 0.02, (0.02-error_rate)/(N[2])), (unusual_rate) => {
              _.each (_.range (0.5, 0.99, (0.99-0.5)/(N[1])), (usual_mixing) => {
                _.each (_.range (0.5, 0.99, (0.99-0.5)/(N[3])), (unusual_mixing) => {
                  _.each (_.range (0.05, 0.5, (0.5-0.05)/(N[5])), (usual_nb)=> {
                  _.each (_.range (0.05, 0.5, (0.5-0.05)/(N[6])), (unusual_nb)=> {

                   const score = pp ([usual_rate,  usual_mixing, unusual_rate, unusual_mixing, error_rate, usual_nb, unusual_nb]);
                   if (score < best_score) {
                      best_score = score;
                      best_values = [usual_rate, usual_mixing, unusual_rate, unusual_mixing,  error_rate, usual_nb, unusual_nb];
                      console.log (best_score, best_values);
                   }})
                  })
                })      
              })        
          })        
      })
  });// error rate
  
  
  
  /*var   points = [
     _.range (0.01,0.1,0.04/(N)),
     _.range (0.01,0.5,0.499/(N)),
     _.range (0.01,0.1,0.04/(N)),
     _.range (0.01,0.5,0.499/(N)),
     _.range (0.0001,0.02,0.02/(N))
  ];*/
  
  const best = fmin.nelderMead (pp, best_values);
  //console.log (best);
  return best;
  // compute points on the grid
  
  
  /*const N = 50;
  var   points = [
     _.range (0.01,0.1,0.04/(N)),
     _.range (0.01,0.5,0.499/(N)),
     _.range (0.01,0.1,0.04/(N)),
     _.range (0.01,0.5,0.499/(N)),
     _.range (0.0001,0.02,0.02/(N))
  ];
  var samples = _.map (_.range (5), (s) => _.shuffle (_.range (N)));
  _.each (_.range (N), (r) => {
      var try_me = fmin.nelderMead (pp, _.map (_.range (5), (i) => points[i][samples[i][r]]));
      console.log (try_me.fx);
      if (try_me.fx < best.fx) {
        best = try_me;
        
      }
  });*/
  
  
  return 0;
}
);
  main.variable(observer("rate_estimates0")).define("rate_estimates0", ["fmin","pp0"], function(fmin,pp0){return(
fmin.nelderMead (pp0, [0.01,0.01])
)});
  main.variable(observer("site_empirical_bayes")).define("site_empirical_bayes", ["log_likelihood_mutation"], function(log_likelihood_mutation){return(
(site, X) => {
  let [usual_rate, usual_mixing, unusual_rate, unusual_mixing, error_rate] = X;
  
  var r_real, mixing;
  if (site.unusual) {
       r_real = unusual_rate;
       mixing = unusual_mixing;
  } else {
       r_real = usual_rate;
       mixing = usual_mixing;    
  }
  
  /*
  var log_error = log_poisson (count, r0*coverage);
   var log_real  = log_nb (count, r*coverage, p);
   let best        = Math.max (log_error, log_real);
  
   return Math.log (proportion_error * Math.exp (log_error - best) + (1-proportion_error) * Math.exp (log_real - best)) + best;*/
  
  let error     = log_likelihood_mutation (site["count"], site["coverage"], r_real, 0.5, error_rate, 1.),
      not_error = log_likelihood_mutation (site["count"], site["coverage"], r_real, 0.5, error_rate, 0.),
      total     = log_likelihood_mutation (site["count"], site["coverage"], r_real, 0.5, error_rate,mixing);
  
  let best = Math.max (error, not_error);
  
  return [Math.exp (error + Math.log (mixing) - total), Math.exp (not_error + Math.log (1-mixing) - total)];
  
}
)});
  main.variable(observer("site_info")).define("site_info", ["_","aa_mutation_data","site_empirical_bayes","rate_estimates"], function(_,aa_mutation_data,site_empirical_bayes,rate_estimates){return(
_.filter (_.map (aa_mutation_data, (site) => [site, site_empirical_bayes(site, rate_estimates['x'])]), (r) => 
  r[1][1] >= 0.99)
)});
  main.variable(observer("min_coverage")).define("min_coverage", function(){return(
100
)});
  const child1 = runtime.module(define1);
  main.import("table", child1);
  main.variable(observer("real_format")).define("real_format", ["d3"], function(d3){return(
d3.format ("2f")
)});
  main.variable(observer("katex")).define("katex", ["require"], function(require){return(
require ('katex')
)});
  main.variable(observer("render_math")).define("render_math", ["DOM","katex"], function(DOM,katex){return(
(expr) => {
  const span = DOM.element('span');
  katex.render(expr, span);
  return span;
}
)});
  main.variable(observer()).define(["html"], function(html){return(
html`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css" integrity="sha384-dbVIfZGuN1Yq7/1Ocstc1lUEm+AT+/rCkibIcC/OmWo5f0EA48Vf8CytHzGrSwbQ" crossorigin="anonymous">`
)});
  main.variable(observer("poission_variate")).define("poission_variate", ["log_factorial"], function(log_factorial){return(
(lambda) => {
 if (lambda < 30) {
     var L = Math.exp (-lambda);
     var k = 0;
     var p = 1.;

     do {
         k += 1;
         p = p * Math.random(0,1);

     } while (p > L);

     return k - 1;
 } else {
     var c = 0.767 - 3.36 / lambda;
     var beta = Math.PI / Math.sqrt (3.0 * lambda);
     var alpha = beta * lambda;
     var k = Math.log(c) - lambda - Math.log (beta);

     while (1) {

         var u = Math.random ();
         if (u > 0.0) {
             var x = (alpha - Math.log ((1.0 - u) / u)) / beta;
             var n = Math.floor (x + 0.5);
             if (n < 0) {
                 continue;
             }
             var v = Math.random ();
             if (v > 0.0) {
                 var y = alpha - beta * x;
                 var t = (1.0 + Math.exp(y));
                 var lhs = y + Math.log (v / (t*t));
                 var rhs = k + n * Math.log (lambda) - log_factorial (n);
                 if (lhs <= rhs)
                     return n;
             }
         }
     }
 }
}
)});
  main.variable(observer("ref_strain")).define("ref_strain", function()
{return {
 'PR' : 'CCTCAGGTCACTCTTTGGCAACGACCCCTCGTCACAATAAAGATAGGGGGGCAACTAAAGGAAGCTCTATTAGATACAGGAGCAGATGATACAGTATTAGAAGAAATGAGTTTGCCAGGAAGATGGAAACCAAAAATGATAGGGGGAATTGGAGGTTTTATCAAAGTAAGACAGTATGATCAGATACTCATAGAAATCTGTGGACATAAAGCTATAGGTACAGTATTAGTAGGACCTACACCTGTCAACATAATTGGAAGAAATCTGTTGACTCAGATTGGTTGCACTTTAAATTTT',
 'RT' : 'CCCATTAGCCCTATTGAGACTGTACCAGTAAAATTAAAGCCAGGAATGGATGGCCCAAAAGTTAAACAATGGCCATTGACAGAAGAAAAAATAAAAGCATTAGTAGAAATTTGTACAGAGATGGAAAAGGAAGGGAAAATTTCAAAAATTGGGCCTGAAAATCCATACAATACTCCAGTATTTGCCATAAAGAAAAAAGACAGTACTAAATGGAGAAAATTAGTAGATTTCAGAGAACTTAATAAGAGAACTCAAGACTTCTGGGAAGTTCAATTAGGAATACCACATCCCGCAGGGTTAAAAAAGAAAAAATCAGTAACAGTACTGGATGTGGGTGATGCATATTTTTCAGTTCCCTTAGATGAAGACTTCAGGAAGTATACTGCATTTACCATACCTAGTATAAACAATGAGACACCAGGGATTAGATATCAGTACAATGTGCTTCCACAGGGATGGAAAGGATCACCAGCAATATTCCAAAGTAGCATGACAAAAATCTTAGAGCCTTTTAGAAAACAAAATCCAGACATAGTTATCTATCAATACATGGATGATTTGTATGTAGGATCTGACTTAGAAATAGGGCAGCATAGAACAAAAATAGAGGAGCTGAGACAACATCTGTTGAGGTGGGGACTTACCACACCAGACAAAAAACATCAGAAAGAACCTCCATTCCTTTGGATGGGTTATGAACTCCATCCTGATAAATGGACAGTACAGCCTATAGTGCTGCCAGAAAAAGACAGCTGGACTGTCAATGACATACAGAAGTTAGTGGGGAAATTGAATTGGGCAAGTCAGATTTACCCAGGGATTAAAGTAAGGCAATTATGTAAACTCCTTAGAGGAACCAAAGCACTAACAGAAGTAATACCACTAACAGAAGAAGCAGAGCTAGAACTGGCAGAAAACAGAGAGATTCTAAAAGAACCAGTACATGGAGTGTATTATGACCCATCAAAAGACTTAATAGCAGAAATACAGAAGCAGGGGCAAGGCCAATGGACATATCAAATTTATCAAGAGCCATTTAAAAATCTGAAAACAGGAAAATATGCAAGAATGAGGGGTGCCCACACTAATGATGTAAAACAATTAACAGAGGCAGTGCAAAAAATAACCACAGAAAGCATAGTAATATGGGGAAAGACTCCTAAATTTAAACTGCCCATACAAAAGGAAACATGGGAAACATGGTGGACAGAGTATTGGCAAGCCACCTGGATTCCTGAGTGGGAGTTTGTTAATACCCCTCCCTTAGTGAAATTATGGTACCAGTTAGAGAAAGAACCCATAGTAGGAGCAGAAACCTTC',
 'IN' : 'TTTTTAGATGGAATAGATAAGGCCCAAGATGAACATGAGAAATATCACAGTAATTGGAGAGCAATGGCTAGTGATTTTAACCTGCCACCTGTAGTAGCAAAAGAAATAGTAGCCAGCTGTGATAAATGTCAGCTAAAAGGAGAAGCCATGCATGGACAAGTAGACTGTAGTCCAGGAATATGGCAACTAGATTGTACACATTTAGAAGGAAAAGTTATCCTGGTAGCAGTTCATGTAGCCAGTGGATATATAGAAGCAGAAGTTATTCCAGCAGAAACAGGGCAGGAAACAGCATATTTTCTTTTAAAATTAGCAGGAAGATGGCCAGTAAAAACAATACATACTGACAATGGCAGCAATTTCACCGGTGCTACGGTTAGGGCCGCCTGTTGGTGGGCGGGAATCAAGCAGGAATTTGGAATTCCCTACAATCCCCAAAGTCAAGGAGTAGTAGAATCTATGAATAAAGAATTAAAGAAAATTATAGGACAGGTAAGAGATCAGGCTG'
}}
);
  main.variable(observer("generate_fake_data")).define("generate_fake_data", ["_","ref_strain","poission_variate"], function(_,ref_strain,poission_variate){return(
(coverage, error_rate, number_of_mutations) => {
    var coverage_counts = {};
    _.each (ref_strain, (value, key) => {
          coverage_counts[key] = _.map (_.range (value.length / 3), (x)=>poission_variate (coverage));
    });
  
    var residues = ['A','C','G','T'];
    
    var mutation_counts = [
      //['gene', 'position', 'coverage' , 'codon' , 'count']
    ];
    _.each (coverage_counts, (counts, key) => {
        _.each (counts, (cov,index) => {
          var mutated_bases  = 0;
          var mutation_count = poission_variate (number_of_mutations);
          const base_codon   = ref_strain[key].substring (index*3,(index+1)*3);
          _.each (_.range (mutation_count), (ignored) => {
              var mutated_count = poission_variate (Math.floor(cov*error_rate));
              var mutated_position = Math.floor(Math.random () * 3);
              var mutated_to = Math.floor(Math.random () * 3);
              var new_codon = '';
              for (var i = 0; i < 3; i++) {
                if (i == mutated_position) {
                    var matched = 0;
                    for (var n = 0; n < 4; n++) {
                      if (base_codon[i] == residues[n]) {
                          matched ++;
                      } else {
                        if (n - matched == mutated_to) {
                            new_codon += residues[n];
                         }
                      }
                    }
                } else {
                  new_codon += base_codon[i];
                }
              }
              mutated_bases += mutated_count;
              mutation_counts.push ([key,'' + (1+index), '' + cov, new_codon, '' + mutated_count]);
          });
          mutation_counts.push ([key,'' + (1+index), '' + cov, base_codon, '' + (cov-mutated_bases)]);


        });
    });
  
    return _.map (mutation_counts, (r)=> r.join ('\t')).join ('\n');
  
}
)});
  return main;
}
