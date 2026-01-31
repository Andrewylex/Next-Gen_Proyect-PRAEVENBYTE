/** PRAEVENSOFT - SCRIPT DE ESTADÍSTICAS ANIMADAS **/
/** Controla todas las animaciones, contadores y efectos interactivos de la sección de estadísticas impactantes. **/

(function() {
    'use strict';
    
    // ============================================
    // CONFIGURACIÓN GLOBAL
    // ============================================
    const CONFIG = {
        duracionAnimacion: 2000,    // 2 segundos para contadores
        retrasoEntreElementos: 100,  // 100ms entre elementos
        umbralScroll: 0.1,           // 10% visible para animaciones
        colorCategoria1: '#e74c3c',  // Rojo
        colorCategoria2: '#f1c40f',  // Amarillo
        colorCategoria3: '#3498db',  // Azul
        colorCategoria4: '#2ecc71',  // Verde
        colorCategoria5: '#9b59b6'   // Morado
    };
    
    // ============================================
    // 1. SISTEMA DE ANIMACIONES AL SCROLL
    // ============================================
    class ScrollAnimator {
        constructor() {
            this.observador = null;
            this.elementosAnimados = new Set();
            this.inicializado = false;
        }
        
        inicializar() {
            if (this.inicializado) return;
            
            // Configurar Intersection Observer
            this.observador = new IntersectionObserver(
                (entries) => this.procesarEntradas(entries),
                {
                    threshold: CONFIG.umbralScroll,
                    rootMargin: '0px 0px -100px 0px'
                }
            );
            
            // Observar todos los elementos con data-aos
            document.querySelectorAll('[data-aos]').forEach(elemento => {
                this.observador.observe(elemento);
            });
            
            // Observar contadores específicos
            document.querySelectorAll('.contador-animado, .contador-grande').forEach(contador => {
                this.observador.observe(contador);
            });
            
            this.inicializado = true;
            console.log('✅ Animaciones de scroll inicializadas');
        }
        
        procesarEntradas(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.elementosAnimados.has(entry.target)) {
                    this.animarElemento(entry.target);
                    this.elementosAnimados.add(entry.target);
                }
            });
        }
        
        animarElemento(elemento) {
            const tipo = elemento.dataset.aos;
            const retraso = elemento.dataset.aosDelay || 0;
            
            setTimeout(() => {
                elemento.classList.add('aos-animate');
                
                // Activar animaciones específicas según el tipo de elemento
                if (elemento.classList.contains('contador-animado')) {
                    this.animarContador(elemento);
                } else if (elemento.classList.contains('contador-grande')) {
                    this.animarContadorGrande(elemento);
                } else if (elemento.querySelector('.grafico-circular')) {
                    this.animarGraficoCircular(elemento);
                } else if (elemento.querySelector('.barra-progreso')) {
                    this.animarBarraProgreso(elemento);
                } else if (elemento.querySelector('.grafico-radial')) {
                    this.animarGraficoRadial(elemento);
                }
            }, parseInt(retraso));
        }
    }
    
    // ============================================
    // 2. SISTEMA DE CONTADORES ANIMADOS
    // ============================================
    class ContadorAnimado {
        constructor(elemento) {
            this.elemento = elemento;
            this.valorFinal = parseInt(elemento.dataset.valor);
            this.prefijo = elemento.querySelector('.prefijo')?.textContent || '';
            this.valorElemento = elemento.querySelector('.valor');
            this.animado = false;
        }
        
        animar() {
            if (this.animado) return;
            this.animado = true;
            
            let valorActual = 0;
            const incremento = this.valorFinal / 50; // 50 pasos
            const intervalo = 30; // ms por paso
            
            const animacion = setInterval(() => {
                valorActual += incremento;
                
                if (valorActual >= this.valorFinal) {
                    valorActual = this.valorFinal;
                    clearInterval(animacion);
                }
                
                this.actualizarValor(valorActual);
            }, intervalo);
        }
        
        actualizarValor(valor) {
            if (this.valorFinal >= 1000000) {
                // Formatear como millones
                const valorFormateado = (valor / 1000000).toFixed(1);
                this.valorElemento.textContent = valorFormateado.endsWith('.0') 
                    ? Math.floor(valor / 1000000) + 'M' 
                    : valorFormateado + 'M';
            } else if (this.valorFinal >= 1000) {
                // Formatear con separadores de miles
                this.valorElemento.textContent = Math.floor(valor).toLocaleString();
            } else {
                this.valorElemento.textContent = Math.floor(valor);
            }
        }
    }
    
    // ============================================
    // 3. SISTEMA DE GRÁFICOS ANIMADOS
    // ============================================
    class GraficosAnimados {
        static animarGraficoCircular(contenedor) {
            const grafico = contenedor.querySelector('.grafico-circular');
            if (!grafico) return;
            
            const porcentaje = parseInt(grafico.dataset.porcentaje);
            const porcentajeElemento = grafico.querySelector('.porcentaje');
            
            // Animar el círculo con CSS variable
            grafico.style.setProperty('--porcentaje', `${porcentaje}%`);
            
            // Animar el número
            let contador = 0;
            const intervalo = setInterval(() => {
                contador++;
                porcentajeElemento.textContent = porcentaje < 100 ? `${contador}%` : `${contador}`;
                
                if (contador >= porcentaje) {
                    clearInterval(intervalo);
                }
            }, CONFIG.duracionAnimacion / porcentaje);
        }
        
        static animarBarraProgreso(contenedor) {
            const barra = contenedor.querySelector('.barra-progreso');
            if (!barra) return;
            
            const porcentaje = parseInt(barra.dataset.porcentaje);
            const valorElemento = contenedor.querySelector('.valor-barra');
            
            // Animar la barra
            barra.style.setProperty('--porcentaje', `${porcentaje}%`);
            
            // Animar el número
            let contador = 0;
            const intervalo = setInterval(() => {
                contador++;
                if (valorElemento) {
                    valorElemento.textContent = `${contador}%`;
                }
                
                if (contador >= porcentaje) {
                    clearInterval(intervalo);
                }
            }, CONFIG.duracionAnimacion / porcentaje);
        }
        
        static animarGraficoRadial(contenedor) {
            const svg = contenedor.querySelector('svg');
            const circulo = svg?.querySelector('.progreso');
            const valorElemento = contenedor.querySelector('.valor-radial');
            
            if (!circulo || !valorElemento) return;
            
            const porcentaje = parseInt(valorElemento.textContent);
            
            // Calcular valores para SVG
            const radio = 40;
            const circunferencia = 2 * Math.PI * radio;
            const offset = circunferencia - (porcentaje / 100) * circunferencia;
            
            // Configurar SVG
            circulo.style.strokeDasharray = `${circunferencia}`;
            circulo.style.strokeDashoffset = `${circunferencia}`;
            circulo.style.setProperty('--porcentaje', porcentaje);
            
            // Animar el valor numérico
            let contador = 0;
            const intervalo = setInterval(() => {
                contador++;
                valorElemento.textContent = `${contador}%`;
                
                if (contador >= porcentaje) {
                    clearInterval(intervalo);
                }
            }, CONFIG.duracionAnimacion / porcentaje);
        }
    }
    
    // ============================================
    // 4. SISTEMA DE EFECTOS HOVER
    // ============================================
    class EfectosHover {
        constructor() {
            this.tarjetas = document.querySelectorAll('.tarjeta-estadistica');
            this.categorias = document.querySelectorAll('.categoria-estadistica');
        }
        
        inicializar() {
            // Efectos en tarjetas individuales
            this.tarjetas.forEach(tarjeta => {
                tarjeta.addEventListener('mouseenter', () => this.entrarTarjeta(tarjeta));
                tarjeta.addEventListener('mouseleave', () => this.salirTarjeta(tarjeta));
            });
            
            // Efectos en categorías completas
            this.categorias.forEach(categoria => {
                categoria.addEventListener('mouseenter', () => this.entrarCategoria(categoria));
                categoria.addEventListener('mouseleave', () => this.salirCategoria(categoria));
            });
            
            console.log('✅ Efectos hover inicializados');
        }
        
        entrarTarjeta(tarjeta) {
            tarjeta.style.transform = 'translateY(-10px) scale(1.02)';
            tarjeta.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.4)';
            tarjeta.style.zIndex = '10';
            
            // Efecto de brillo
            const brillo = document.createElement('div');
            brillo.className = 'brillo-hover';
            brillo.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
                pointer-events: none;
                border-radius: 15px;
            `;
            tarjeta.appendChild(brillo);
        }
        
        salirTarjeta(tarjeta) {
            tarjeta.style.transform = 'translateY(0) scale(1)';
            tarjeta.style.boxShadow = '';
            tarjeta.style.zIndex = '';
            
            // Remover brillo
            const brillo = tarjeta.querySelector('.brillo-hover');
            if (brillo) brillo.remove();
        }
        
        entrarCategoria(categoria) {
            const icono = categoria.querySelector('.icono-categoria');
            if (icono) {
                icono.style.transform = 'scale(1.1) rotate(5deg)';
            }
        }
        
        salirCategoria(categoria) {
            const icono = categoria.querySelector('.icono-categoria');
            if (icono) {
                icono.style.transform = 'scale(1) rotate(0deg)';
            }
        }
    }
    
    // ============================================
    // 5. SISTEMA DE IMÁGENES INTERACTIVAS
    // ============================================
    class ImagenesInteractivas {
        constructor() {
            this.imagenes = document.querySelectorAll('.imagen-categoria img');
        }
        
        inicializar() {
            this.imagenes.forEach(img => {
                // Precargar imágenes con fade in
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                // Verificar si la imagen ya está cargada
                if (img.complete) {
                    this.mostrarImagen(img);
                } else {
                    img.addEventListener('load', () => this.mostrarImagen(img));
                    img.addEventListener('error', () => this.imagenError(img));
                }
                
                // Efecto parallax en scroll
                window.addEventListener('scroll', () => this.efectoParallax(img));
            });
            
            console.log('✅ Sistema de imágenes inicializado');
        }
        
        mostrarImagen(img) {
            setTimeout(() => {
                img.style.opacity = '1';
            }, 300);
        }
        
        imagenError(img) {
            console.warn(`⚠️ No se pudo cargar la imagen: ${img.src}`);
            img.style.opacity = '1';
            img.style.filter = 'grayscale(100%)';
            
            // Agregar indicador de error
            const errorMsg = document.createElement('div');
            errorMsg.textContent = 'Imagen no disponible';
            errorMsg.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #e74c3c;
                font-family: 'Poppins', sans-serif;
                font-size: 0.9rem;
                text-align: center;
            `;
            img.parentElement.appendChild(errorMsg);
        }
        
        efectoParallax(img) {
            const rect = img.getBoundingClientRect();
            const velocidad = 0.3;
            const movimiento = (window.innerHeight - rect.top) * velocidad;
            
            img.style.transform = `translateY(${movimiento * 0.1}px)`;
        }
    }
    
    // ============================================
    // 6. SISTEMA DE BOTONES INTERACTIVOS
    // ============================================
    class BotonesInteractivos {
        constructor() {
            this.botones = document.querySelectorAll('.boton-mision');
        }
        
        inicializar() {
            this.botones.forEach(boton => {
                boton.addEventListener('click', (e) => this.efectoClic(boton, e));
                boton.addEventListener('mouseenter', () => this.efectoHover(boton));
                boton.addEventListener('mouseleave', () => this.efectoSalida(boton));
            });
            
            console.log('✅ Botones interactivos inicializados');
        }
        
        efectoHover(boton) {
            boton.style.transform = 'translateY(-3px)';
            const icono = boton.querySelector('i');
            if (icono) {
                icono.style.transform = 'translateX(5px)';
            }
        }
        
        efectoSalida(boton) {
            boton.style.transform = 'translateY(0)';
            const icono = boton.querySelector('i');
            if (icono) {
                icono.style.transform = 'translateX(0)';
            }
        }
        
        efectoClic(boton, evento) {
            // Efecto de ondas
            const circulo = document.createElement('span');
            const diametro = Math.max(boton.clientWidth, boton.clientHeight);
            const radio = diametro / 2;
            
            circulo.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: onda-efecto 0.6s linear;
                width: ${diametro}px;
                height: ${diametro}px;
                left: ${evento.clientX - boton.getBoundingClientRect().left - radio}px;
                top: ${evento.clientY - boton.getBoundingClientRect().top - radio}px;
                pointer-events: none;
            `;
            
            // Agregar animación CSS temporal
            const estilo = document.createElement('style');
            estilo.textContent = `
                @keyframes onda-efecto {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(estilo);
            
            boton.appendChild(circulo);
            
            // Limpiar después de la animación
            setTimeout(() => {
                circulo.remove();
                estilo.remove();
            }, 600);
        }
    }
    
    // ============================================
    // 7. SISTEMA DE SONIDOS/EFECTOS (OPCIONAL)
    // ============================================
    class EfectosSonoros {
        constructor() {
            this.activado = false;
            this.contextoAudio = null;
        }
        
        inicializar() {
            // Solo activar si el usuario ha interactuado
            document.addEventListener('click', () => this.activar(), { once: true });
        }
        
        activar() {
            if (this.activado) return;
            
            try {
                // Crear contexto de audio (Web Audio API)
                this.contextoAudio = new (window.AudioContext || window.webkitAudioContext)();
                this.activado = true;
                console.log('🔊 Sistema de audio activado');
            } catch (error) {
                console.warn('⚠️ Audio no soportado en este navegador');
            }
        }
        
        reproducirSonido(frecuencia = 440, duracion = 0.1) {
            if (!this.activado || !this.contextoAudio) return;
            
            try {
                const oscilador = this.contextoAudio.createOscillator();
                const ganancia = this.contextoAudio.createGain();
                
                oscilador.connect(ganancia);
                ganancia.connect(this.contextoAudio.destination);
                
                oscilador.frequency.value = frecuencia;
                ganancia.gain.setValueAtTime(0.1, this.contextoAudio.currentTime);
                ganancia.gain.exponentialRampToValueAtTime(0.01, this.contextoAudio.currentTime + duracion);
                
                oscilador.start();
                oscilador.stop(this.contextoAudio.currentTime + duracion);
            } catch (error) {
                console.warn('⚠️ Error reproduciendo sonido:', error);
            }
        }
    }
    
    // ============================================
    // 8. SISTEMA DE MONITOREO DE RENDIMIENTO
    // ============================================
    class MonitorRendimiento {
        constructor() {
            this.tiempoInicio = performance.now();
            this.eventos = [];
        }
        
        registrar(evento) {
            this.eventos.push({
                evento,
                tiempo: performance.now() - this.tiempoInicio,
                memoria: performance.memory ? performance.memory.usedJSHeapSize : null
            });
        }
        
        generarReporte() {
            console.group('📊 Reporte de Rendimiento - Estadísticas');
            console.log('⏱️ Tiempo total:', (performance.now() - this.tiempoInicio).toFixed(2), 'ms');
            console.log('🔢 Eventos registrados:', this.eventos.length);
            
            if (performance.memory) {
                const mbUsados = performance.memory.usedJSHeapSize / 1048576;
                console.log('💾 Memoria usada:', mbUsados.toFixed(2), 'MB');
            }
            
            console.table(this.eventos.slice(-10)); // Últimos 10 eventos
            console.groupEnd();
        }
    }
    
    // ============================================
    // 9. INICIALIZACIÓN PRINCIPAL
    // ============================================
    class EstadisticasApp {
        constructor() {
            this.monitor = new MonitorRendimiento();
            this.scrollAnimator = new ScrollAnimator();
            this.efectosHover = new EfectosHover();
            this.imagenesInteractivas = new ImagenesInteractivas();
            this.botonesInteractivos = new BotonesInteractivos();
            this.efectosSonoros = new EfectosSonoros();
            this.inicializada = false;
        }
        
        inicializar() {
            if (this.inicializada) return;
            
            this.monitor.registrar('Inicio inicialización');
            
            // Inicializar componentes en orden
            try {
                this.scrollAnimator.inicializar();
                this.efectosHover.inicializar();
                this.imagenesInteractivas.inicializar();
                this.botonesInteractivos.inicializar();
                this.efectosSonoros.inicializar();
                
                // Configurar eventos globales
                this.configurarEventosGlobales();
                
                // Animar elementos ya visibles al cargar
                setTimeout(() => this.animarElementosVisibles(), 500);
                
                this.inicializada = true;
                this.monitor.registrar('Inicialización completada');
                
                console.log('🚀 Aplicación de estadísticas inicializada correctamente');
                
                // Generar reporte después de 3 segundos
                setTimeout(() => this.monitor.generarReporte(), 3000);
                
            } catch (error) {
                console.error('❌ Error inicializando la aplicación:', error);
                this.monitor.registrar(`Error: ${error.message}`);
            }
        }
        
        configurarEventosGlobales() {
            // Recargar animaciones al redimensionar
            window.addEventListener('resize', () => {
                this.recalcularAnimaciones();
            });
            
            // Pausar animaciones cuando la página no es visible
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pausarAnimaciones();
                } else {
                    this.reanudarAnimaciones();
                }
            });
            
            // Capturar errores no controlados
            window.addEventListener('error', (evento) => {
                console.error('⚠️ Error no controlado:', evento.error);
                this.monitor.registrar(`Error no controlado: ${evento.message}`);
            });
        }
        
        animarElementosVisibles() {
            // Animar elementos que ya están visibles al cargar
            const elementos = document.querySelectorAll('[data-aos]');
            elementos.forEach(elemento => {
                const rect = elemento.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.8) {
                    elemento.classList.add('aos-animate');
                    
                    // Animar contadores visibles
                    if (elemento.querySelector('.contador-animado')) {
                        const contador = new ContadorAnimado(elemento.querySelector('.contador-animado'));
                        contador.animar();
                    }
                }
            });
        }
        
        recalcularAnimaciones() {
            // Limpiar y recalcular animaciones basadas en el nuevo tamaño
            this.scrollAnimator.elementosAnimados.clear();
            document.querySelectorAll('[data-aos].aos-animate').forEach(el => {
                el.classList.remove('aos-animate');
            });
            
            setTimeout(() => {
                this.animarElementosVisibles();
            }, 100);
        }
        
        pausarAnimaciones() {
            // Pausar animaciones CSS
            document.querySelectorAll('[data-aos].aos-animate').forEach(el => {
                el.style.animationPlayState = 'paused';
            });
        }
        
        reanudarAnimaciones() {
            // Reanudar animaciones CSS
            document.querySelectorAll('[data-aos].aos-animate').forEach(el => {
                el.style.animationPlayState = 'running';
            });
        }
    }
    
    // ============================================
    // 10. INICIALIZACIÓN AUTOMÁTICA AL CARGAR
    // ============================================
    
    // Esperar a que el DOM esté completamente cargado
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🔄 DOM cargado, iniciando aplicación...');
        
        // Crear e inicializar la aplicación
        window.appEstadisticas = new EstadisticasApp();
        
        // Pequeño retraso para asegurar que todo esté listo
        setTimeout(() => {
            window.appEstadisticas.inicializar();
        }, 100);
    });
    
    // Exportar para uso externo si es necesario
    window.EstadisticasAnimadas = {
        ScrollAnimator,
        ContadorAnimado,
        GraficosAnimados,
        EfectosHover,
        ImagenesInteractivas,
        BotonesInteractivos,
        EfectosSonoros,
        MonitorRendimiento,
        EstadisticasApp
    };
    
    console.log('📦 Módulo de estadísticas cargado correctamente');
    
})();