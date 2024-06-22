(() => {
  'use strict';
  const e = (e, t) => (t || document).querySelector(e),
    t = (e, t) => (t || document).querySelectorAll(e),
    i = (e, t, i, s) => {
      e.addEventListener(t, i, !!s);
    },
    s = (e, s, o, l) => {
      i(
        e,
        o,
        function (i) {
          const o = i.target,
            d = t(s, e);
          Array.prototype.indexOf.call(d, o) >= 0 && l.call(o, i);
        },
        'blur' === o || 'focus' === o
      );
    },
    o = (e, t) => {
      if (e.parentNode)
        return e.parentNode.tagName.toLowerCase() === t.toLowerCase()
          ? e.parentNode
          : o(e.parentNode, t);
    };
  NodeList.prototype.forEach = Array.prototype.forEach;
  const l = (e) => {
    const t = o(e, 'li');
    return parseInt(t.dataset.id, 10);
  };
  class d {
    constructor(t) {
      (this.template = t),
        (this.$todoList = e('.todo-list')),
        (this.$todoItemCounter = e('.todo-count')),
        (this.$clearCompleted = e('.clear-completed')),
        (this.$main = e('.main')),
        (this.$footer = e('.footer')),
        (this.$toggleAllInput = e('.toggle-all')),
        (this.$toggleAll = e('.toggle-all-label')),
        (this.$newTodo = e('.new-todo')),
        (this.render = this.render.bind(this)),
        (this.bindCallback = this.bindCallback.bind(this));
    }
    _clearCompletedButton(e, t) {
      (this.$clearCompleted.innerHTML = this.template.clearCompletedButton(e)),
        (this.$clearCompleted.style.display = t ? 'block' : 'none');
    }
    render(i, s) {
      switch (i) {
        case 'showEntries':
          this.$todoList.innerHTML = this.template.show(s);
          break;
        case 'updateElementCount':
          this.$todoItemCounter.innerHTML = this.template.itemCounter(s);
          break;
        case 'contentBlockVisibility':
          this.$main.style.display = this.$footer.style.display = s.visible
            ? 'block'
            : 'none';
          break;
        case 'toggleAll':
          this.$toggleAllInput.checked = s.checked;
          break;
        case 'clearNewTodo':
          this.$newTodo.value = '';
          break;
        case 'removeItem':
          ((t, i) => {
            const s = e(`[data-id="${t}"]`);
            s && i.removeChild(s);
          })(s, this.$todoList);
          break;
        case 'setFilter':
          (o = s),
            (e('.filters .selected').className = ''),
            (e(`.filters [href="#/${o}"]`).className = 'selected');
          break;
        case 'elementComplete':
          ((t, i) => {
            const s = e(`[data-id="${t}"]`);
            s &&
              ((s.className = i ? 'completed' : ''),
              (e('input', s).checked = i));
          })(s.id, s.completed);
          break;
        case 'editItem':
          ((t, i) => {
            const s = e(`[data-id="${t}"]`);
            if (!s) return;
            s.className = `${s.className} editing`;
            const o = document.createElement('input');
            (o.className = 'edit'), s.appendChild(o), o.focus(), (o.value = i);
          })(s.id, s.title);
          break;
        case 'editItemDone':
          ((i, s) => {
            const o = e(`[data-id="${i}"]`);
            if (!o) return;
            const l = e('input.edit', o);
            o.removeChild(l),
              (o.className = o.className.replace(' editing', '')),
              t('label', o).forEach((e) => {
                e.textContent = s;
              });
          })(s.id, s.title);
          break;
        case 'clearCompletedButton':
          this._clearCompletedButton(
            s.completed,
            s.visible,
            this.clearCompletedButton
          );
      }
      var o;
    }
    bindCallback(e, t) {
      switch (e) {
        case 'newTodo':
          i(this.$newTodo, 'change', () => t(this.$newTodo.value));
          break;
        case 'removeCompleted':
          i(this.$clearCompleted, 'click', t);
          break;
        case 'toggleAll':
          i(this.$toggleAll, 'click', () => {
            this.$toggleAllInput.click(),
              t({ completed: this.$toggleAllInput.checked });
          });
          break;
        case 'itemEdit':
          s(this.$todoList, 'li label', 'dblclick', (e) =>
            t({ id: l(e.target) })
          );
          break;
        case 'itemRemove':
          s(this.$todoList, '.destroy', 'click', (e) => t({ id: l(e.target) }));
          break;
        case 'itemToggle':
          s(this.$todoList, '.toggle', 'click', (e) =>
            t({ id: l(e.target), completed: e.target.checked })
          );
          break;
        case 'itemEditDone':
          s(this.$todoList, 'li .edit', 'blur', function (e) {
            e.target.dataset.iscanceled ||
              t({ id: l(e.target), title: e.target.value });
          }),
            s(this.$todoList, 'li .edit', 'keypress', function (e) {
              13 === e.keyCode && e.target.blur();
            });
          break;
        case 'itemEditCancel':
          s(this.$todoList, 'li .edit', 'keyup', (e) => {
            27 === e.keyCode &&
              ((e.target.dataset.iscanceled = !0),
              e.target.blur(),
              t({ id: l(e.target) }));
          });
      }
    }
  }
  let a = 1,
    r = {};
  const n = {
      '&': '&amp',
      '<': '&lt',
      '>': '&gt',
      '"': '&quot',
      "'": '&#x27',
      '`': '&#x60',
    },
    c = /[&<>"'`]/g,
    h = new RegExp(c.source),
    m = (e) => n[e];
  let p;
  const g = () => {
    p.controller.setView(document.location.hash);
  };
  function u(e) {
    (this.storage = new (class {
      constructor(e, t) {
        if (((this._dbName = e), !r[e])) {
          const t = { todos: [] };
          r[e] = JSON.stringify(t);
        }
        t && t(JSON.parse(r[e]));
      }
      find(e, t) {
        if (!t) return;
        const { todos: i } = JSON.parse(r[this._dbName]);
        t(
          i.filter((t) => {
            for (let i in e) if (e[i] !== t[i]) return !1;
            return !0;
          })
        );
      }
      findAll(e) {
        e && e(JSON.parse(r[this._dbName]).todos);
      }
      save(e, t, i) {
        const s = JSON.parse(r[this._dbName]),
          { todos: o } = s;
        if (i) {
          for (let t = 0; t < o.length; t++)
            if (o[t].id === i) {
              for (let i in e) o[t][i] = e[i];
              break;
            }
          (r[this._dbName] = JSON.stringify(s)),
            t && t(JSON.parse(r[this._dbName]).todos);
        } else
          (e.id = a++),
            o.push(e),
            (r[this._dbName] = JSON.stringify(s)),
            t && t([e]);
      }
      remove(e, t) {
        const i = JSON.parse(r[this._dbName]),
          { todos: s } = i;
        for (let t = 0; t < s.length; t++)
          if (s[t].id === e) {
            s.splice(t, 1);
            break;
          }
        (r[this._dbName] = JSON.stringify(i)),
          t && t(JSON.parse(r[this._dbName]).todos);
      }
      drop(e) {
        (r[this._dbName] = JSON.stringify({ todos: [] })),
          e && e(JSON.parse(r[this._dbName]).todos);
      }
    })(e)),
      (this.model = new (class {
        constructor(e) {
          this.storage = e;
        }
        create(e, t) {
          const i = { title: (e = e || '').trim(), completed: !1 };
          this.storage.save(i, t);
        }
        read(e, t) {
          const i = typeof e;
          'function' === i
            ? ((t = e), this.storage.findAll(t))
            : 'string' === i || 'number' === i
            ? ((e = parseInt(e, 10)), this.storage.find({ id: e }, t))
            : this.storage.find(e, t);
        }
        update(e, t, i) {
          this.storage.save(t, i, e);
        }
        remove(e, t) {
          this.storage.remove(e, t);
        }
        removeAll(e) {
          this.storage.drop(e);
        }
        getCount(e) {
          if (!e) return;
          const t = { active: 0, completed: 0, total: 0 };
          this.storage.findAll((i) => {
            for (let e of i)
              e.completed ? t.completed++ : t.active++, t.total++;
            e(t);
          });
        }
      })(this.storage)),
      (this.template = new (class {
        show(e) {
          let t = '';
          return (
            e.reverse().forEach((e, i) => {
              var s;
              t += (({ id: e, title: t, completed: i, checked: s, index: o }) =>
                `\n<li data-id="${e}" class="${i}">\n    <div class="view">\n        <input class="toggle" type="checkbox" ${s}>\n        <label>${t}</label>\n        <button class="destroy"></button>\n    </div>\n</li>\n`)(
                {
                  id: e.id,
                  title: ((s = e.title), s && h.test(s) ? s.replace(c, m) : s),
                  completed: e.completed ? 'completed' : '',
                  checked: e.completed ? 'checked' : '',
                  index: i,
                }
              );
            }),
            t
          );
        }
        itemCounter(e) {
          return `<strong>${e}</strong> item${1 === e ? '' : 's'} left`;
        }
        clearCompletedButton(e) {
          return e > 0 ? 'Clear completed' : '';
        }
      })()),
      (this.view = new d(this.template)),
      (this.controller = new (class {
        constructor(e, t) {
          (this.model = e),
            (this.view = t),
            this.view.bindCallback('newTodo', (e) => this.addItem(e)),
            this.view.bindCallback('itemEdit', (e) => this.editItem(e.id)),
            this.view.bindCallback('itemEditDone', (e) =>
              this.editItemSave(e.id, e.title)
            ),
            this.view.bindCallback('itemEditCancel', (e) =>
              this.editItemCancel(e.id)
            ),
            this.view.bindCallback('itemRemove', (e) => this.removeItem(e.id)),
            this.view.bindCallback('itemToggle', (e) =>
              this.toggleComplete(e.id, e.completed)
            ),
            this.view.bindCallback('removeCompleted', () =>
              this.removeCompletedItems()
            ),
            this.view.bindCallback('toggleAll', (e) =>
              this.toggleAll(e.completed)
            );
        }
        setView(e) {
          const t = e.split('/')[1] || '';
          this._updateFilter(t);
        }
        showAll() {
          this.model.read((e) => this.view.render('showEntries', e));
        }
        showActive() {
          this.model.read({ completed: !1 }, (e) =>
            this.view.render('showEntries', e)
          );
        }
        showCompleted() {
          this.model.read({ completed: !0 }, (e) =>
            this.view.render('showEntries', e)
          );
        }
        addItem(e) {
          '' !== e.trim() &&
            this.model.create(e, () => {
              this.view.render('clearNewTodo'), this._filter(!0);
            });
        }
        editItem(e) {
          this.model.read(e, (t) => {
            let i = t[0].title;
            this.view.render('editItem', { id: e, title: i });
          });
        }
        editItemSave(e, t) {
          0 !== (t = t.trim()).length
            ? this.model.update(e, { title: t }, () => {
                this.view.render('editItemDone', { id: e, title: t });
              })
            : this.removeItem(e);
        }
        editItemCancel(e) {
          this.model.read(e, (t) => {
            const i = t[0].title;
            this.view.render('editItemDone', { id: e, title: i });
          });
        }
        removeItem(e) {
          this.model.remove(e, () => this.view.render('removeItem', e)),
            this._filter();
        }
        removeCompletedItems() {
          this.model.read({ completed: !0 }, (e) => {
            for (let t of e) this.removeItem(t.id);
          }),
            this._filter();
        }
        toggleComplete(e, t, i) {
          this.model.update(e, { completed: t }, () => {
            this.view.render('elementComplete', { id: e, completed: t });
          }),
            i || this._filter();
        }
        toggleAll(e) {
          this.model.read({ completed: !e }, (t) => {
            for (let i of t) this.toggleComplete(i.id, e, !0);
          }),
            this._filter();
        }
        _updateCount() {
          this.model.getCount((e) => {
            const t = e.completed,
              i = t > 0,
              s = t === e.total;
            this.view.render('updateElementCount', e.active),
              this.view.render('clearCompletedButton', {
                completed: t,
                visible: i,
              }),
              this.view.render('toggleAll', { checked: s }),
              this.view.render('contentBlockVisibility', {
                visible: e.total > 0,
              });
          });
        }
        _filter(e) {
          const t = this._activeRoute,
            i = t.charAt(0).toUpperCase() + t.substr(1);
          this._updateCount(),
            (e ||
              'All' !== this._lastActiveRoute ||
              this._lastActiveRoute !== i) &&
              this[`show${i}`](),
            (this._lastActiveRoute = i);
        }
        _updateFilter(e) {
          (this._activeRoute = e),
            '' === e && (this._activeRoute = 'All'),
            this._filter(),
            this.view.render('setFilter', e);
        }
      })(this.model, this.view));
  }
  window.addEventListener('load', () => {
    (p = new u('javascript-es6-webpack')), g();
  }),
    window.addEventListener('hashchange', g);
})();
