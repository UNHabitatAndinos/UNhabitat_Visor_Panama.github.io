// Create variable to hold map element, give initial settings to map
var map = L.map('map', {
    center: [9.10, -79.58],
    zoom: 10,
    minZoom: 10,
    scrollWheelZoom: false,
});

map.once('focus', function() { map.scrollWheelZoom.enable(); });

L.easyButton('<img src="images/fullscreen.png">', function (btn, map) {
    var cucu = [9.10, -79.58];
    map.setView(cucu, 10);
}).addTo(map);

var esriAerialUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services' +
    '/World_Imagery/MapServer/tile/{z}/{y}/{x}';
var esriAerialAttrib = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, ' +
    'USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the' +
    ' GIS User Community';
var esriAerial = new L.TileLayer(esriAerialUrl,
    {maxZoom: 18, attribution: esriAerialAttrib}).addTo(map);


var opens = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
});


var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = (props ?
        'Distrito ' + props.DISTRITO + '<br />' + 
        'Corregimiento ' + props.CORR_NOM + '<br />' + 
        'Proyección población ' + props.Pop_2020  + ' (año 2020) <br />' +  '<br />' + 
        
        '<b>Vivienda </b>' + '<br />' +
        'Vivienda adecuada: ' + props.VIV_DUR.toFixed(0) + ' %' + '<br />' +
        'Espacio vital suficiente: ' + props.ESP_VIT.toFixed(0) + ' %' + '<br />' +
        'Agua mejorada: ' + props.AGU_MEJ.toFixed(0) + ' %' + '<br />' +
        'Saneamiento: ' + props.SAN_ADE.toFixed(0) + ' %' + '<br />' +
        'Electricidad: ' + props.ACC_ELE.toFixed(0) + ' %' + '<br />' +
        'Internet: ' + props.ACC_INT.toFixed(0) + ' %' + '<br />' +'<br />' +

        '<b>Salud</b>' + '<br />' +
        'Proximidad centros de salud: ' + props.DxP_SALUD.toFixed(0) + ' m' + '<br />' +  
        'Contaminación residuos sólidos: ' + props.CON_SOL.toFixed(2) + ' %' + '<br />' +  '<br />' +   
        
        '<b>Educación, cultura y diversidad </b>' + '<br />' +
        'Proximidad equipamientos culturales: ' + props.DxP_BIBLIO.toFixed(0) + ' m' + '<br />' +
        'Proximidad equipamientos educativos: ' + props.DxP_EDUCA.toFixed(0) + ' m' + '<br />' +  '<br />' +  
        
        '<b>Espacios públicos, seguridad y recreación </b>' + '<br />' +
        'Proximidad espacio público: ' + props.DxP_EP.toFixed(0) + ' m' + '<br />' +
        'Densidad residencial: ' + props.Dens_Res.toFixed(2) +'<br />' + 
        'Tasa de homicidios x 100mil habitantes: ' + props.HOMICI +'<br />' +
        'Diversidad usos del suelo: ' + props.Shannon.toFixed(2) + '/1.61' +'<br />' + '<br />' +

        '<b>Oportunidades económicas </b>' + '<br />' +
        'Desempleo: ' + props.DESEMPL.toFixed(2) + ' %' + '<br />' +
        'Empleo informal: ' + props.EMP_INF.toFixed(2) + ' %' + '<br />' +
        'Desempleo juvenil: ' + props.Desemp_Juv.toFixed(2) + ' %' : 'Seleccione una manzana');
  
};
info.addTo(map);

function stylec(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: '#ffffff',
        fillOpacity: 0,
        dashArray: '3',
    };
}

var loc = L.geoJson(localidad, {
    style: stylec,
    onEachFeature: popupText,
}).addTo(map);

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: 'black',
        dashArray: '',
        fillColor: false
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

var manzanas;

function resetHighlight(e) {
    manzanas.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

function style(feature) {
    return {
        weight: 0.6,
        opacity: 0.5,
        color: '#ffffff00',
        fillOpacity: 0,
    };
}


function changeLegend(props) {
    var _legend = document.getElementById('legend'); // create a div with a class "info"
    _legend.innerHTML = (props ?
        `<p style="font-size: 11px"><strong>${props.title}</strong></p>
            <p>${props.subtitle}</p>
            <p id='colors'>
                ${props.elem1}
                ${props.elem2}
                ${props.elem3}
                ${props.elem4}
                ${props.elem5}
                ${props.elem6}
                ${props.elem7}<br>
                <span style='color:#000000'>Fuente: </span>${props.elem8}<br>
            </p>` :
        `<p style="font-size: 12px"><strong>Área urbana</strong></p>
            <p id='colors'>
                <span style='color:#c3bfc2'>▉</span>Manzanas<br>
            </p>`);
}

var legends = {
    DxP_SALUD: {
        title: "Proximidad equipamientos de salud",
        subtitle: "Distancia en metros con factor inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 500</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>501 - 1500</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>1501 - 3000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>3001 - 5000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>5001 - 11135</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Ministerio de Salud 2021",
    },
    DxP_EDUCA: {
        title: "Proximidad equipamientos de educación",
        subtitle: "Distancia en metros con factor inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 500</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>501 - 1500</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>1501 - 3000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>3001 - 5000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>5001 - 7749</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Alcaldía de Panamá 2021",
    },
    DxP_BIBLIO: {
        title: "Proximidad equipamientos culturales",
        subtitle: "Distancia en metros con factor inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 500</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>501 - 2000</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>2001 - 10000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>10001 - 20000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>20001 - 40293</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Google Earth y Biblioteca Nacional de Panamá 2021",
    },
    DxP_EP: {
        title: "Proximidad espacio público",
        subtitle: "Distancia en metros con factor inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 500</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>501 - 2000</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>2001 - 5000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>5001 - 10000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>10001 - 19955</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Google Earth 2021",
    },
    PM10: {
        title: "Concentración Pm10",
        subtitle: "µg/m3",
        elem1: '<div><span  style= "color:#1a9641">▉</span>37 - 38</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>39 - 40</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>41 - 42</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>43 - 44</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>45 - 46</div>',
        elem6: ' ',
        elem7: ' ',
        elem8: "Secretaría de Ambiente de Quito Red Metropolitana de Monitoreo Ambiental REMMAQ 2020",
    },
    VIV_DUR: {
        title: "Vivienda adecuada",
        subtitle: "% de Viviendas", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>97 - 100</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>92 - 96</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>85 - 91</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>67 - 84</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>16 - 66</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo Nacional de Población y Vivienda 2010",
    },
    ESP_VIT: {
        title: "Espacio vital suficiente",
        subtitle: "% de Viviendas", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>95 - 100</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>85 - 94</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>67 - 84</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>31 - 66</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0 - 30</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo Nacional de Población y Vivienda 2010",
    },
    AGU_MEJ: {
        title: "Acceso a agua mejorada",
        subtitle: "% de Viviendas", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>95 - 100</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>87 - 94</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>71 - 86</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>48 - 70</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>6 - 47</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo Nacional de Población y Vivienda 2010",
    },
    SAN_ADE: {
        title: "Acceso a saneamiento",
        subtitle: "% de Viviendas", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>78 - 100</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>63 - 77</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>47 - 62</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>28 - 46</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>1 - 27</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo Nacional de Población y Vivienda 2010",
    },
    ACC_ELE: {
        title: "Acceso a electricidad",
        subtitle: "% de Viviendas", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>89 - 100</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>81 - 88</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>69 - 80</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>46 - 68</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>2 - 45</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo Nacional de Población y Vivienda 2010",
    },
    ACC_INT: {
        title: "Acceso a internet",
        subtitle: "% de Viviendas", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>67 - 96</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>46 - 66</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>28 - 35</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>15 - 27</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0 - 14</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo Nacional de Población y Vivienda 2010",
    },
    CON_SOL: {
        title: "Contaminación residuos sólidos",
        subtitle: "% de Viviendas",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 16</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>17 - 29</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>30 - 45</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>46 - 65</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>66 - 100</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo Nacional de Población y Vivienda 2010",
    },
    M2_EP_CA: {
        title: "M² per capita de espacio público",
        subtitle: "m²/habitante",
        elem1: '<div><span  style= "color:#1a9641">▉</span>Mayor 14</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>11 - 14</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>5 - 10</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>3 - 4</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0 - 2</div>',
        elem6: '',
        elem7: '',
        elem8: "Gobierno Abierto de Quito 2020",
    },
    Dens_Res: {
        title: "Densidad residencial",
        subtitle: "Población proyectada año 2020 x kilómetro cuadrado", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>48 - 1000</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>1001 - 5000</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>5001 - 8000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>8001 - 10000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>10001 - 38612</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo Nacional de Población y Vivienda 2010",
    },
    T_Homici_2: {
        title: "Tasa de homicidios",
        subtitle: "Homicidios x 100mil habitantes",
        elem1: '<div><span  style= "color:#1a9641">▉</span>2.89 - 4.94</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>4.95 - 11.34</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>11.35 - 21.92</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>21.93 - 38.09</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>38.10 - 68.17</div>',
        elem6: '<div><span  style= "color:#c3bfc2">▉</span>Sin información</div>',
        elem7: '',
        elem8: "Ministerio de Seguridad Pública 2020",
    },
    Shannon: {
        title: "Diversidad usos del suelo",
        subtitle: "Índice de Shannon-Wienner -  Nivel de diversidad por manzana",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0.65 - 1.10</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>0.43 - 0.64</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>0.25 - 0.42</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>0.10 - 0.24</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0.00 - 0.09</div>',
        elem6: '',
        elem7: '',
        elem8: "Plan de Uso y Ocupación del Suelo 2020",
    },
    DESEMPL: {
        title: "Tasa de desempleo",
        subtitle: "% Personas",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0.03 - 2.45</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>2.46 - 3.73</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>3.74 - 4.83</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>4.84 - 6.54</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>6.55 - 15.74</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo Nacional de Población y Vivienda 2010",
    },
    EMP_INF: {
        title: "Empleo informal",
        subtitle: "% Personas",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0.18 - 12.19</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>12.20 - 17.26</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>17.27 - 22.41</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>22.42 - 29.88</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>29.89 - 49.93</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo Nacional de Población y Vivienda 2010",
    },
    Desemp_Juv: {
        title: "Desempleo juvenil",
        subtitle: "% Personas",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0.05 - 3.42</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>3.43 - 5.79</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>5.80 - 8.19</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>8.20 - 12.67</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>12.67 - 29.27</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo Nacional de Población y Vivienda 2010",
    },
}

var indi = L.geoJson(Manzana, {
    style: legends.Dens_Res,
}).addTo(map);

var currentStyle = 'Dens_Res';

manzanas = L.geoJson(Manzana, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


function setProColor(d) {
    if (currentStyle === 'DxP_SALUD') {
        return d > 5000 ? '#d7191c' :
            d > 3000 ? '#fdae61' :
                d > 1500 ? '#f4f466' :
                    d > 500 ? '#a6d96a' :
                    '#1a9641';
    }else if (currentStyle === 'DxP_EDUCA') {
        return d > 5000 ? '#d7191c' :
            d > 3000 ? '#fdae61' :
                d > 1500 ? '#f4f466' :
                    d > 500 ? '#a6d96a' :
                    '#1a9641';
    } 
    else if (currentStyle === 'DxP_EP') {
        return d > 10000 ? '#d7191c' :
            d > 5000 ? '#fdae61' :
                d > 2000 ? '#f4f466' :
                    d > 500 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'VIV_DUR') {
        return d > 96 ? '#1a9641' :
            d > 91 ? '#a6d96a' :
                d > 84 ? '#f4f466' :
                    d > 66 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'ESP_VIT') {
        return d > 94 ? '#1a9641' :
            d > 84 ? '#a6d96a' :
                d > 66 ? '#f4f466' :
                    d > 30 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'AGU_MEJ') {
        return d > 94 ? '#1a9641' :
            d > 86 ? '#a6d96a' :
                d > 70 ? '#f4f466' :
                    d > 47 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'SAN_ADE') {
        return d > 77 ? '#1a9641' :
            d > 62 ? '#a6d96a' :
                d > 46 ? '#f4f466' :
                    d > 27 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'ACC_ELE') {
        return d > 88 ? '#1a9641' :
            d > 80 ? '#a6d96a' :
                d > 68 ? '#f4f466' :
                    d > 45 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'ACC_INT') {
        return d > 66 ? '#1a9641' :
            d > 45 ? '#a6d96a' :
                d > 27 ? '#f4f466' :
                    d > 14 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'PM10') {
        return d > 45 ? '#d7191c' :
            d > 43 ? '#fdae61' :
                d > 40 ? '#f4f466' :
                    d > 39 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'CON_SOL') {
        return d > 65 ? '#d7191c' :
            d > 45 ? '#fdae61' :
                d > 29 ? '#f4f466' :
                    d > 16 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'DxP_BIBLIO') {
        return d > 20000 ? '#d7191c' :
            d > 10000 ? '#fdae61' :
                d > 2000 ? '#f4f466' :
                    d > 500 ? '#a6d96a' :
                    '#1a9641';
    }

    else if (currentStyle === 'Dens_Res') {
        return d > 10000 ?  '#d7191c':
            d > 8000 ? '#fdae61' :
                d > 5000 ? '#f4f466' :
                    d > 1000 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'Tasa_Hurto') {
        return d > 2357 ?  '#d7191c':
            d > 1256.4 ? '#fdae61' :
                d > 716.2 ? '#f4f466' :
                    d > 395.5 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'T_Homici_2') {
        return d > 38.09 ?  '#d7191c':
            d > 21.92 ? '#fdae61' :
                d > 11.34 ? '#f4f466' :
                    d > 4.94 ? '#a6d96a' :
                    d > 2.8 ? '#1a9641':
                    '#c3bfc2';
    }
    else if (currentStyle === 'Shannon') {
        return d > 0.64 ? '#1a9641' :
            d > 0.42 ? '#a6d96a' :
                d > 0.24 ? '#f4f466' :
                    d > 0.09 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'DxP_Comer') {
        return d > 5000 ?  '#d7191c':
            d > 3000 ? '#fdae61' :
                d > 1500 ? '#f4f466' :
                    d > 500 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'DESEMPL') {
        return d > 6.54 ?  '#d7191c':
            d > 4.83 ? '#fdae61' :
                d > 3.73 ? '#f4f466' :
                    d > 2.45 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'EMP_INF') {
        return d > 29.88 ?  '#d7191c':
            d > 22.41 ? '#fdae61' :
                d > 17.26 ? '#f4f466' :
                    d > 12.19 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'Desemp_Juv') {
        return d > 12.67 ?  '#d7191c':
            d > 8.19 ? '#fdae61' :
                d > 5.79 ? '#f4f466' :
                    d > 3.42 ? '#a6d96a' :
                    '#1a9641';
    }
    else {
        return d > 44 ? '#d7191c' :
            d > 42 ? '#fdae61' :
                d > 40 ? '#f4f466' :
                    d > 38 ? '#a6d96a' :
                    '#1a9641';
    }

}


function fillColor(feature) {
    return {
        fillColor:  setProColor(feature.properties[currentStyle]),
        weight: 0.6,
        opacity: 0.1,
        color: (currentStyle) ? '#ffffff00' : '#c3bfc2', 
        fillOpacity: (currentStyle) ? 0.9 : 0.5,
    };
}

function changeIndi(style) {
    currentStyle = style.value;
    indi.setStyle(fillColor);
    changeLegend((style.value && legends[style.value]) ? legends[style.value] :
        {
            
        });
}

var baseMaps = {
    'Esri Satellite': esriAerial,
    'Open Street Map': opens

};

// Defines the overlay maps. For now this variable is empty, because we haven't created any overlay layers
var overlayMaps = {
    //'Comunas': comu,
    //'Límite fronterizo con Venezuela': lim
};

// Adds a Leaflet layer control, using basemaps and overlay maps defined above
var layersControl = new L.Control.Layers(baseMaps, overlayMaps, {
    collapsed: true,
});
map.addControl(layersControl);
changeIndi({value: 'Dens_Res'});

function popupText(feature, layer) {
    layer.bindPopup('Corregimiento ' + feature.properties.CORR_NOM + '<br />')
}
