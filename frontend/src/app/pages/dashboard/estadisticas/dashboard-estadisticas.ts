import { AfterViewInit, Component, ElementRef, OnDestroy, signal, viewChildren } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartType, registerables } from 'chart.js';
import { Modal } from '../../../shared/modal/modal';
import { API_URL, mensajeDeError } from '../../../api';

Chart.register(...registerables);
Chart.defaults.color = '#d9c9f2';
Chart.defaults.borderColor = 'rgba(0, 240, 255, 0.18)';
Chart.defaults.font.family = "'Chakra Petch', sans-serif";

interface Grafico {
  titulo: string;
  ruta: string;
  tipo: ChartType;
  campoEtiqueta: string;
  rotulo: string;
  rango: FormGroup<{ desde: FormControl<string>; hasta: FormControl<string> }>;
  vacio: ReturnType<typeof signal<boolean>>;
  chart?: Chart;
}

const COLORES = ['#ff2e97', '#00f0ff', '#ffd23f', '#ff7b3a', '#9b5cff', '#3dff8b', '#ff6b8b', '#5b6bff'];

function fechaLocal(fecha: Date) {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');

  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

function rangoInicial() {
  const hoy = new Date();
  const desde = new Date();
  desde.setDate(hoy.getDate() - 30);

  return new FormGroup({
    desde: new FormControl(fechaLocal(desde), { nonNullable: true }),
    hasta: new FormControl(fechaLocal(hoy), { nonNullable: true }),
  });
}

@Component({
  imports: [ReactiveFormsModule, Modal],
  selector: 'app-dashboard-estadisticas',
  styleUrl: './dashboard-estadisticas.scss',
  templateUrl: './dashboard-estadisticas.html',
})
export class DashboardEstadisticas implements AfterViewInit, OnDestroy {
  lienzos = viewChildren<ElementRef<HTMLCanvasElement>>('lienzo');
  mensajeModal = signal('');

  graficos: Grafico[] = [
    {
      titulo: 'Publicaciones por usuario',
      ruta: 'publicaciones-por-usuario',
      tipo: 'bar',
      campoEtiqueta: 'usuario',
      rotulo: 'Publicaciones',
      rango: rangoInicial(),
      vacio: signal(false),
    },
    {
      titulo: 'Comentarios realizados',
      ruta: 'comentarios',
      tipo: 'line',
      campoEtiqueta: 'fecha',
      rotulo: 'Comentarios por día',
      rango: rangoInicial(),
      vacio: signal(false),
    },
    {
      titulo: 'Comentarios por publicación',
      ruta: 'comentarios-por-publicacion',
      tipo: 'pie',
      campoEtiqueta: 'publicacion',
      rotulo: 'Comentarios',
      rango: rangoInicial(),
      vacio: signal(false),
    },
  ];

  constructor(private http: HttpClient) { }

  ngAfterViewInit() {
    this.graficos.forEach((grafico, indice) => this.cargar(grafico, indice));
  }

  ngOnDestroy() {
    this.graficos.forEach((grafico) => grafico.chart?.destroy());
  }

  cargar(grafico: Grafico, indice: number) {
    const { desde, hasta } = grafico.rango.getRawValue();

    if (desde && hasta && desde > hasta) {
      this.mensajeModal.set('La fecha desde no puede ser posterior a la fecha hasta');
      return;
    }

    const params: Record<string, string> = {};

    if (desde) {
      params['desde'] = desde;
    }

    if (hasta) {
      params['hasta'] = hasta;
    }

    this.http.get<Record<string, string | number>[]>(`${API_URL}/estadisticas/${grafico.ruta}`, { params })
      .subscribe({
        next: (filas) => this.dibujar(grafico, indice, filas),
        error: (error) => {
          this.mensajeModal.set(mensajeDeError(error, 'No se pudieron cargar las estadísticas'));
        },
      });
  }

  private dibujar(grafico: Grafico, indice: number, filas: Record<string, string | number>[]) {
    grafico.chart?.destroy();
    grafico.vacio.set(filas.length === 0);

    const etiquetas = filas.map((fila) => String(fila[grafico.campoEtiqueta]));
    const valores = filas.map((fila) => Number(fila['cantidad']));
    const esLinea = grafico.tipo === 'line';
    const color = esLinea || grafico.tipo === 'bar' ? COLORES[0] : filas.map((_, i) => COLORES[i % COLORES.length]);

    grafico.chart = new Chart(this.lienzos()[indice].nativeElement, {
      type: grafico.tipo,
      data: {
        labels: etiquetas,
        datasets: [{
          label: grafico.rotulo,
          data: valores,
          backgroundColor: color,
          borderColor: color,
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        scales: grafico.tipo === 'pie' ? {} : { y: { beginAtZero: true, ticks: { precision: 0 } } },
      },
    });
  }
}
