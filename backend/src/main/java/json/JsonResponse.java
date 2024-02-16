package json;

public class JsonResponse<T> {
    private final String error;
    private final T value;

    public JsonResponse(T value){
        this.value = value;
        this.error = null;
    }

    private JsonResponse(String error){
        this.value = null;
        this.error = error;
    }

    public static <T> JsonResponse<T> getErrorResponse(String error){
        return new JsonResponse<>(error);
    }
}
