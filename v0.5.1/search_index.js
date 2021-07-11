var documenterSearchIndex = {"docs":
[{"location":"api/#API-1","page":"API","title":"API","text":"","category":"section"},{"location":"api/#","page":"API","title":"API","text":"DocTestSetup  = quote\n    using ValueShapes\nend","category":"page"},{"location":"api/#Types-1","page":"API","title":"Types","text":"","category":"section"},{"location":"api/#","page":"API","title":"API","text":"Order = [:type]","category":"page"},{"location":"api/#Functions-1","page":"API","title":"Functions","text":"","category":"section"},{"location":"api/#","page":"API","title":"API","text":"Order = [:function]","category":"page"},{"location":"api/#Documentation-1","page":"API","title":"Documentation","text":"","category":"section"},{"location":"api/#","page":"API","title":"API","text":"Modules = [ValueShapes]\nOrder = [:type, :function]","category":"page"},{"location":"api/#ValueShapes.AbstractScalarShape","page":"API","title":"ValueShapes.AbstractScalarShape","text":"AbstractScalarShape{T} <: AbstractValueShape\n\n\n\n\n\n","category":"type"},{"location":"api/#ValueShapes.AbstractValueShape","page":"API","title":"ValueShapes.AbstractValueShape","text":"abstract type AbstractValueShape\n\nAn AbstractValueShape combines type and size information.\n\nSubtypes are defined for shapes of scalars (see ScalarShape), arrays (see ArrayShape), constant values (see ConstValueShape) and NamedTuples (see NamedTupleShape).\n\nSubtypes of AbstractValueShape must support eltype, size and totalndof.\n\nValue shapes can be used as constructors to generate values of the given shape with undefined content. If the element type of the shape is an abstract or union type, a suitable concrete type will be chosen automatically, if possible (see ValueShapes.default_datatype):\n\nshape = ArrayShape{Real}(2,3)\nA = shape(undef)\ntypeof(A) == Array{Float64,2}\nsize(A) == (2, 3)\nvalshape(A) == ArrayShape{Float64}(2,3)\n\nUse\n\n(shape::AbstractValueShape)(data::AbstractVector{<:Real})::eltype(shape)\n\nto view a flat vector of anonymous real values as a value of the given shape:\n\ndata = [1, 2, 3, 4, 5, 6]\nshape(data) == [1 3 5; 2 4 6]\n\nIn return,\n\nBase.Vector{T}(undef, shape::AbstractValueShape)\nBase.Vector(undef, shape::AbstractValueShape)\n\nwill create a suitable uninitialized vector of the right length to hold such flat data for the given shape. If no type T is given, a suitable data type will be chosen automatically.\n\nWhen dealing with multiple vectors of flattened data, use\n\nshape.(data::ArrayOfArrays.AbstractVectorOfSimilarVectors)\n\nValueShapes supports this via specialized broadcasting.\n\nIn return,\n\nArraysOfArrays.VectorOfSimilarVectors{T}(shape::AbstractValueShape)\nArraysOfArrays.VectorOfSimilarVectors(shape::AbstractValueShape)\n\nwill create a suitable vector (of length zero) of vectors that can hold flattened data for the given shape. The result will be a VectorOfSimilarVectors wrapped around a 2-dimensional ElasticArray. This way, all data is stored in a single contiguous chunk of memory.\n\n\n\n\n\n","category":"type"},{"location":"api/#ValueShapes.ArrayShape","page":"API","title":"ValueShapes.ArrayShape","text":"ArrayShape{T,N} <: AbstractValueShape\n\nDescribes the shape of N-dimensional arrays of type T and a given size.\n\nConstructor:\n\nArrayShape{T}(dims::NTuple{N,Integer}) where {T,N}\nArrayShape{T}(dims::Integer...) where {T}\n\ne.g.\n\nshape = ArrayShape{Real}(2, 3)\n\nIn addition to using the shape as a value constructor\n\nsize(shape(undef)) == (2, 3)\neltype(shape(undef)) == Float64\n\n(see AbstractValueShape), a shape can also be used as an argument of certains array type constructors to explicitly construct standard Arrays or ElasticArrays:\n\nusing ElasticArrays\n\nsize(Array(undef, shape)) == (2, 3)\neltype(Array(undef, shape)) == Float64\n\nsize(ElasticArray(undef, shape)) == (2, 3)\n\nSee also the documentation of AbstractValueShape.\n\n\n\n\n\n","category":"type"},{"location":"api/#ValueShapes.ConstValueShape","page":"API","title":"ValueShapes.ConstValueShape","text":"ConstValueShape{T} <: AbstractValueShape\n\nA ConstValueShape describes the shape of constant values of type T.\n\nConstructor:\n\nConstValueShape(value)\n\nvalue may be of arbitrary type, e.g. a constant scalar value or array:\n\nConstValueShape(4.2)\nConstValueShape([11 21; 12 22])\n\nShapes of constant values have zero degrees of freedom (see totalndof).\n\nSee also the documentation of AbstractValueShape.\n\n\n\n\n\n","category":"type"},{"location":"api/#ValueShapes.NamedTupleShape","page":"API","title":"ValueShapes.NamedTupleShape","text":"NamedTupleShape{names,...} <: AbstractValueShape\n\nDefines the shape of a NamedTuple (resp.  set of variables, parameters, etc.).\n\nConstructors:\n\nNamedTupleShape(name1 = shape1::AbstractValueShape, ...)\nNamedTupleShape(named_shapes::NamedTuple)\n\ne.g.\n\nshape = NamedTupleShape(\n    a = ArrayShape{Real}(2, 3),\n    b = ScalarShape{Real}(),\n    c = ArrayShape{Real}(4)\n)\n\nExample:\n\nshape = NamedTupleShape(\n    a = ScalarShape{Real}(),\n    b = ArrayShape{Real}(2, 3),\n    c = ConstValueShape(42)\n)\ndata = VectorOfSimilarVectors{Float64}(shape)\nresize!(data, 10)\nrand!(flatview(data))\ntable = shape.(data)\nfill!(table.a, 4.2)\nall(x -> x == 4.2, view(flatview(data), 1, :))\n\nSee also the documentation of AbstractValueShape.\n\n\n\n\n\n","category":"type"},{"location":"api/#ValueShapes.ScalarShape","page":"API","title":"ValueShapes.ScalarShape","text":"ScalarShape{T} <: AbstractScalarShape{T}\n\nAn ScalarShape describes the shape of scalar values of a given type.\n\nConstructor:\n\nScalarShape{T::Type}()\n\nT may be an abstract type of Union, or a specific type, e.g.\n\nScalarShape{Real}()\nScalarShape{Integer}()\nScalarShape{Float32}()\nScalarShape{Complex}()\n\nScalar shapes may have a total number of degrees of freedom (see totalndof) greater than one, e.g. shapes of complex-valued scalars:\n\ntotalndof(ScalarShape{Real}()) == 1\ntotalndof(ScalarShape{Complex}()) == 2\n\nSee also the documentation of AbstractValueShape.\n\n\n\n\n\n","category":"type"},{"location":"api/#ValueShapes.ValueAccessor","page":"API","title":"ValueShapes.ValueAccessor","text":"ValueAccessor{S<:AbstractValueShape}\n\nA value accessor provides a means to access a value with a given shape stored in a flat real-valued data vector with a given offset position.\n\nConstructor:\n\nValueAccessor{S}(shape::S, offset::Int)\n\nThe offset is relative to the first index of a flat data array, so if the value is stored at the beginning of the array, the offset will be zero.\n\nAn ValueAccessor can be used to index into a given flat data array.\n\nExample:\n\nacc = ValueAccessor(ArrayShape{Real}(2,3), 2)\nvalshape(acc) == ArrayShape{Real,2}((2, 3))\ndata = [1, 2, 3, 4, 5, 6, 7, 8, 9]\ndata[acc] == [3 5 7; 4 6 8]\n\n\n\n\n\n","category":"type"},{"location":"api/#ValueShapes.totalndof","page":"API","title":"ValueShapes.totalndof","text":"totalndof(shape::AbstractValueShape)\n\nGet the total number of degrees of freedom of values of the given shape.\n\nEquivalent to the length of a vector that would result from flattening the data into a sequence of real numbers, excluding any constant values.\n\n\n\n\n\n","category":"function"},{"location":"api/#ValueShapes.valshape","page":"API","title":"ValueShapes.valshape","text":"valshape(x)::AbstractValueShape\nvalshape(acc::ValueAccessor)::AbstractValueShape\nvalshape(d::Distributions.Distribution)::AbstractValueShape\n\nGet the value shape of an arbitrary value, resp. the shape a ValueAccessor is based on, or the shape of the variates for a Distribution.\n\n\n\n\n\n","category":"function"},{"location":"api/#ValueShapes.default_datatype","page":"API","title":"ValueShapes.default_datatype","text":"ValueShapes.default_datatype(T::Type)\n\nReturn a default specific type U that is more specific than T, with U <: T.\n\ne.g.\n\nValueShapes.default_datatype(Real) == Float64\nValueShapes.default_datatype(Complex) == Complex{Float64}\n\n\n\n\n\n","category":"function"},{"location":"LICENSE/#LICENSE-1","page":"LICENSE","title":"LICENSE","text":"","category":"section"},{"location":"LICENSE/#","page":"LICENSE","title":"LICENSE","text":"using Markdown\nMarkdown.parse_file(joinpath(@__DIR__, \"..\", \"..\", \"LICENSE.md\"))","category":"page"},{"location":"#ValueShapes.jl-1","page":"Home","title":"ValueShapes.jl","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"ValueShapes provides Julia types to describe the shape of values, like scalars, arrays and structures.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Shapes provide a generic way to construct uninitialized values (e.g. multidimensional arrays) without using templates.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Shapes also act as a bridge between structured and flat data representations: Mathematical and statistical algorithms (e.g. optimizers, fitters, solvers, etc.) often represent variables/parameters as flat vectors of nameless real values. But user code will usually be more concise and readable if variables/parameters can have names (e.g. via NamedTuples) and non-scalar shapes. ValueShapes provides a duality of view between the two different data representations.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"ValueShapes defines the shape of a value as the combination of it's data type (resp. element type, in the case of arrays) and the size of the value (relevant if the value is an array), e.g.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"using ValueShapes\n\nScalarShape{Real}()\nArrayShape{Real}(2, 3)\nConstValueShape([1 2; 3 4])","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Array shapes can be used to construct a compatible real-valued data vector:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Array(undef, ArrayShape{Real}(2, 3)) isa Array{Float64,2}","category":"page"},{"location":"#","page":"Home","title":"Home","text":"ValueShapes also provides a way to define the shape of a NamedTuple. This can be used to specify the names and shapes of a set of variables or parameters. Consider a fitting problem with the following parameters: A scalar a, a 2x3 array b and an array c pinned to a fixed value. This set parameters can be specified as","category":"page"},{"location":"#","page":"Home","title":"Home","text":"parshapes = NamedTupleShape(\n    a = ScalarShape{Real}(),\n    b = ArrayShape{Real}(2, 3),\n    c = ConstValueShape([1 2; 3 4])\n)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"This set of parameters has","category":"page"},{"location":"#","page":"Home","title":"Home","text":"totalndof(parshapes) == 7","category":"page"},{"location":"#","page":"Home","title":"Home","text":"total degrees of freedom (the constant c does not contribute). The flat data representation for this NamedTupleShape is a vector of length 7:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"using Random\n\ndata = Vector{Float64}(undef, parshapes)\nsize(data) == (7,)\nrand!(data)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"which can again be viewed as a NamedTuple described by shape via","category":"page"},{"location":"#","page":"Home","title":"Home","text":"data_as_ntuple = parshapes(data)\n\ntypeof(data_as_ntuple) <: NamedTuple{(:a, :b, :c)}","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Note: The package EponymTuples may come in handy to define functions that take such tuples as parameters and deconstruct them, so that the variable names can be used directly inside the function body. The macro @unpack provided by the package Parameters can be used to unpack NamedTuples selectively.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"ValueShapes can also handle multiple values for sets of variables and is designed to compose well with ArraysOfArrays and TypedTables (and similar table packages):","category":"page"},{"location":"#","page":"Home","title":"Home","text":"using ArraysOfArrays, Tables, TypedTables\n\nmultidata = VectorOfSimilarVectors{Int}(parshapes)\nresize!(multidata, 10)\nrand!(flatview(multidata), 0:99)\n\ntable = parshapes.(multidata)\nkeys(Tables.columns(table)) == (:a, :b, :c)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"ValueShapes supports this via specialized broadcasting.","category":"page"}]
}
