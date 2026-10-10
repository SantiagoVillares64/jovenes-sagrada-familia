"""Genera los archivos .html de cada página (todos usan la misma plantilla; el contenido lo arma js/site.js).

Uso:  python herramientas/generar_paginas.py
      python herramientas/generar_paginas.py --url https://USUARIO.github.io/REPO/
Con --url (la dirección final de la web) también arma sitemap.xml y robots.txt,
y deja absolutos los links de vista previa (WhatsApp, Instagram). La URL queda guardada en herramientas/datos/url.txt.
Para sumar una página: agregá una línea en PAGES y su función P.<nombre> en js/site.js.
"""
import os, sys, json
OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # carpeta de la web
PAGES = [
    ('index.html', 'inicio', 'Jóvenes Sagrada Familia', 'Grupos, misas, adoración y misiones para jóvenes de la Parroquia Sagrada Familia de Nordelta.'),
    ('faro.html', 'grupo:faro', 'FARO · Jóvenes Sagrada Familia', 'FARO, pre-confirmación para 3er y 4to año en la Parroquia Sagrada Familia de Nordelta.'),
    ('confirmacion.html', 'grupo:confirmacion', 'Confirmación · Jóvenes Sagrada Familia', 'Confirmación para 4to y 5to año en la Parroquia Sagrada Familia de Nordelta.'),
    ('post.html', 'grupo:post', 'Post · Jóvenes Sagrada Familia', 'Post-confirmación para 5to y 6to año en la Parroquia Sagrada Familia de Nordelta.'),
    ('hpp.html', 'grupo:hpp', 'HPP · Jóvenes Sagrada Familia', 'HPP, perseverancia para 6to año y universitarios en la Parroquia Sagrada Familia de Nordelta.'),
    ('puente-a-maria.html', 'grupo:puente', 'Puente a María · Jóvenes Sagrada Familia', 'Puente a María, grupo misionero de la Parroquia Sagrada Familia de Nordelta.'),
    ('nazaret.html', 'grupo:nazaret', 'Nazaret · Jóvenes Sagrada Familia', 'Nazaret, para universitarios y profesionales en la Parroquia Sagrada Familia de Nordelta.'),
    ('horarios.html', 'horarios', 'Horarios · Jóvenes Sagrada Familia', 'Horarios de misa, confesiones y adoración de la Parroquia Sagrada Familia de Nordelta.'),
    ('recursos.html', 'recursos', 'Recursos · Jóvenes Sagrada Familia', 'Biblioteca temática para crecer en la fe: lecturas, podcasts, pelis y santos.'),
    ('santos.html', 'santos', 'Diccionario de santos · Jóvenes Sagrada Familia', 'Diccionario de santos: fiestas, historias y datos de los santos y beatos queridos por la comunidad.'),
    ('academia.html', 'academia', 'Academia Frassati · Jóvenes Sagrada Familia', 'Academia Frassati: cursos cortos de formación con examen y certificado. Los sacramentos, la misa parte por parte, cómo ser un buen coordinador y más. Hacia lo alto.'),
    ('juegos.html', 'juegos', 'Juegos · Jóvenes Sagrada Familia', 'Santo del día, Versículo del día, Conexiones, Crucigrama del día, ranking parroquial y un quiz sobre la fe y la comunidad.'),
    ('calendario.html', 'calendario', 'Calendario · Jóvenes Sagrada Familia', 'Retiros, misiones, peregrinaciones y eventos de los grupos de jóvenes de Sagrada Familia.'),
    ('privacidad.html', 'privacidad', 'Privacidad · Jóvenes Sagrada Familia', 'Política de privacidad de Jóvenes Sagrada Familia y la Academia Frassati: qué datos guardamos y cómo pedir que los borremos.'),
    ('sumate.html', 'sumate', 'Sumate · Jóvenes Sagrada Familia', 'Inscripciones y contacto de los grupos de jóvenes de Sagrada Familia.'),
]
TPL = '''<!doctype html>
<html lang="es-AR">
<head>
  <meta charset="utf-8">{basetag}
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="{base}img/hero-iglesia.jpg">{abs}
  <meta name="theme-color" content="#4e5f58">
  <link rel="icon" type="image/png" href="img/favicon.png">
  <link rel="apple-touch-icon" href="img/apple-touch-icon.png">
  <link rel="manifest" href="manifest.webmanifest">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700&family=Montserrat:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
{fuentes}  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="css/paginas.css">
</head>
<body data-page="{page}">
  <a class="skip" href="#page">Ir al contenido</a>
  <div id="site-header"></div>
  <main id="page"></main>
  <div id="site-footer"></div>
  <script src="js/contenido.js"></script>{extra}
  <script src="js/site.js"></script>
</body>
</html>
'''
URL_TXT = os.path.join(OUT, 'herramientas', 'datos', 'url.txt')
url = ''
if '--url' in sys.argv:
    url = sys.argv[sys.argv.index('--url') + 1].strip()
    open(URL_TXT, 'w', encoding='utf-8').write(url)
elif os.path.exists(URL_TXT):
    url = open(URL_TXT, encoding='utf-8').read().strip()
if url and not url.endswith('/'):
    url += '/'

# el 404 se sirve desde cualquier ruta: necesita saber dónde está la raíz de la web
if url:
    BASE_404 = '\n  <base href="%s">' % url
else:
    BASE_404 = ('\n  <script>(function(){var p=location.pathname.split("/");'
                'var b=/github\\.io$/.test(location.hostname)&&p.length>2?"/"+p[1]+"/":"/";'
                'document.write(\'<base href="\'+b+\'">\');})();</script>')

todas = PAGES + [('404.html', 'noencontrado', 'Página no encontrada · Jóvenes Sagrada Familia', 'Esta página no existe.')]
for f, page, title, desc in todas:
    extra = '\n  <script src="js/juegos-datos.js"></script>' if page in ('juegos', 'santos', 'calendario') else ''
    if page == 'academia':
        extra = '\n  <script src="js/formacion-datos.js"></script>'
    fuentes = ('  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">\n') if page in ('academia', 'recursos') else ''
    pagina_url = url + ('' if f == 'index.html' else f)
    if page == 'noencontrado':
        abs_ = '\n  <meta name="robots" content="noindex">'
    elif url:
        abs_ = '\n  <meta property="og:url" content="%s">\n  <link rel="canonical" href="%s">' % (pagina_url, pagina_url)
    else:
        abs_ = ''
    open(os.path.join(OUT, f), 'w', encoding='utf-8').write(TPL.format(
        title=title, desc=desc, page=page, extra=extra, base=url, abs=abs_, fuentes=fuentes,
        basetag=BASE_404 if page == 'noencontrado' else ''))

# la dirección vieja de la Academia redirige a la nueva
open(os.path.join(OUT, 'formacion.html'), 'w', encoding='utf-8').write(
    '<!doctype html>\n<html lang="es-AR"><head><meta charset="utf-8"><title>Academia Frassati</title>\n'
    '<meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=academia.html">\n'
    '<script>location.replace("academia.html" + location.hash);</script></head>\n'
    '<body><p><a href="academia.html">La Academia Frassati se mudó: entrá acá.</a></p></body></html>\n')

manifest = {
    'name': 'Jóvenes Sagrada Familia', 'short_name': 'Jóvenes SF', 'lang': 'es-AR',
    'start_url': 'index.html', 'display': 'standalone',
    'background_color': '#ffffff', 'theme_color': '#4e5f58',
    'icons': [{'src': 'img/icono-192.png', 'sizes': '192x192', 'type': 'image/png'},
              {'src': 'img/icono-512.png', 'sizes': '512x512', 'type': 'image/png'}],
}
open(os.path.join(OUT, 'manifest.webmanifest'), 'w', encoding='utf-8').write(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')

if url:
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    sm += ['  <url><loc>%s</loc></url>' % (url + ('' if p[0] == 'index.html' else p[0])) for p in PAGES]
    sm.append('</urlset>')
    open(os.path.join(OUT, 'sitemap.xml'), 'w', encoding='utf-8').write('\n'.join(sm) + '\n')
    open(os.path.join(OUT, 'robots.txt'), 'w', encoding='utf-8').write('User-agent: *\nAllow: /\n\nSitemap: %ssitemap.xml\n' % url)
    print('ok', len(todas), 'páginas + manifest + sitemap.xml + robots.txt para', url)
else:
    print('ok', len(todas), 'páginas + manifest (sin --url todavía: faltan sitemap.xml y robots.txt)')
