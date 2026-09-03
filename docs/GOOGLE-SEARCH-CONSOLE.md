# Etapa 5.11 — Google Search Console, indexação, sitemap e monitoramento SEO

## Objetivo

Conectar o Dejotacode ao Google Search Console (GSC), enviar o sitemap e estabelecer uma rotina de monitoramento de indexação, desempenho orgânico e Core Web Vitals.

## 1. Criar a propriedade

No Google Search Console, adicione uma propriedade de **Domínio** (`dejotacode.com.br`) ou uma propriedade de **Prefixo de URL** (`https://dejotacode.com.br/`).

Para a propriedade de domínio, a verificação normalmente é feita por DNS. Para prefixo de URL, também é possível usar uma meta tag.

### Meta tag pronta no projeto

Configure a variável de ambiente:

```env
PUBLIC_GOOGLE_SITE_VERIFICATION=SEU_TOKEN_DO_GOOGLE
```

O componente `SearchConsoleVerification.astro` só renderiza a tag quando a variável existe.

## 2. Enviar o sitemap

Depois de publicar o site, informe no Search Console:

```text
https://dejotacode.com.br/sitemap-index.xml
```

O sitemap é gerado pelo `@astrojs/sitemap` durante o build.

## 3. Inspeção de URL

Após publicar páginas importantes, use a inspeção de URL para verificar:

- se a URL pode ser rastreada;
- se a página está indexada;
- URL canônica selecionada;
- recursos e problemas encontrados;
- possibilidade de solicitar indexação quando necessário.

Não solicitar indexação de todas as páginas em massa. Priorizar páginas novas, atualizadas e estratégicas.

## 4. Rotina semanal

### Indexação
- páginas válidas;
- páginas excluídas;
- erros de rastreamento;
- páginas descobertas, mas não indexadas;
- páginas rastreadas, mas não indexadas.

### Desempenho
- cliques;
- impressões;
- CTR;
- posição média;
- consultas principais;
- páginas que ganharam ou perderam tráfego.

### Experiência
- Core Web Vitals;
- HTTPS;
- problemas de usabilidade;
- problemas de segurança.

## 5. Rotina mensal

Criar um relatório simples comparando os últimos 28 dias com o período anterior:

| Indicador | Pergunta |
|---|---|
| Cliques | O tráfego orgânico cresceu? |
| Impressões | Estamos aparecendo para mais buscas? |
| CTR | Nossos resultados estão atraindo cliques? |
| Posição | Quais páginas estão próximas da primeira página? |
| Indexação | O Google está encontrando nosso conteúdo? |
| CWV | Há páginas com problemas de experiência? |

## 6. Ciclo de otimização

```text
Search Console
      ↓
Dados de busca
      ↓
Identificar oportunidade
      ↓
Melhorar conteúdo / título / links internos
      ↓
Publicar
      ↓
Aguardar dados
      ↓
Comparar novamente
```

## 7. Checklist antes de publicar

- [ ] título único e descritivo;
- [ ] meta description útil;
- [ ] URL curta e estável;
- [ ] canonical correto;
- [ ] conteúdo alinhado à intenção de busca;
- [ ] links internos relevantes;
- [ ] imagem otimizada e com `alt`;
- [ ] sitemap sendo atualizado no build;
- [ ] página acessível sem JavaScript essencial;
- [ ] CTA coerente com a intenção do visitante.

## 8. Importante

Search Console é uma ferramenta de monitoramento. Não existe garantia de indexação ou ranking simplesmente por enviar um sitemap.

O objetivo desta etapa é criar um **loop de dados → decisão → melhoria**, e não perseguir posições isoladas.
